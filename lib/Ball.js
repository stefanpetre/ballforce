import Vect from './Vect.js';
import Layer from './Layer.js';
import {round} from './math.js';

export default class Ball {
    constructor(x, y, radius, mass = 1) {
        this.pos = new Vect(x, y);
        this.vel = new Vect();
        this.acc = new Vect();
        this.mass = mass;
        this.radius = radius;
        this.drawBuffer();
        this.stopped = false;
    }

    drawBuffer() {
        this.layer = new Layer(this.radius * 2, this.radius * 2);

        //this.layer.context.shadowColor = '#FDD0F8';
        //this.layer.context.shadowBlur = 6;
        this.layer.context.fillStyle = '#FDD0F8';

        this.layer.context.beginPath();
        this.layer.context.arc(
            this.radius,
            this.radius,
            this.radius,
            0,
            2 * Math.PI,
            false
        );
        this.layer.context.fill();
    }

    calculateDrag() {
        const dragForce = this.vel.clone();
        dragForce.mult(-0.0001);
        return dragForce;
    }

    update(dt, gravityForce, stage) {
        if (this.stopped) {
            return;
        }
        this.prev = this.pos.clone();
        //this.calculateDrag()
        this.applyForce(gravityForce)
        this.applyForce(this.calculateDrag());
        this.vel.add(this.acc);
        this.pos.add(this.vel, dt);
        this.acc.mult(0);
        this.checkHit(stage);
        if (round(this.prev.x,2) == round(this.pos.x, 2)) {
           this.stopped = true;
            console.log('stopped');
        }
    }

    draw(context, stage) {
        this.layer.drawTo(context, /*this.pos.x - this.radius*/ 200, this.pos.y - this.radius);
        const touceSurface = (stage.height- this.radius*3);
        const inverse = touceSurface - this.pos.y - this.radius;
        context.globalAlpha = 0.5;
        this.layer.drawTo(context, 200, touceSurface + inverse);
        context.globalAlpha = 1;
        context.fillText(this.pos.x, 10, 100);
    }

    applyForce(force) {
        const f = force.clone();
        f.div(this.mass);
        this.acc.add(f);
        this.stopped = false;
    }

    checkHit(stage) {
        if (this.pos.y + this.radius*4 > stage.height) {
            this.vel.mult(0.95);
            this.vel.y *= -1;
            this.pos.y = stage.height-this.radius*4;
        }
        if (this.pos.x < 0)  {
            this.vel.x *= -0.9; 
            this.pos.x = 0;
        }
    }
}