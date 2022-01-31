import Layer from './Layer.js';
import Mountains from './Mountains.js';

export default class Background {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.ground = this.createGround();
        this.sky = this.createSky();
        this.horizon = this.createHorizon();
        this.mountains = [
            new Mountains(0, 0,  this.width, this.height*.75, 100,0.5, '#5D3E57',4),
            new Mountains(0, this.height*.25,  this.width, this.height*.5, 100, 0.7, '#391635',2),
            new Mountains(0, this.height*.5,  this.width, this.height*.25, 100),
        ];
    }

    createHorizon() {
        const layer = new Layer(this.width, 40);
        layer.y = this.height * .75 - 20;
        layer.context.shadowColor = '#FDD0F8';
        layer.context.shadowBlur = 6;
        layer.context.fillStyle = '#FDD0F8';
        layer.context.fillRect(0, 19, this.width, 2);
        return layer;
    }

    createSky() {
        const layer = new Layer(this.width, this.height * .75);
        var grad = layer.context.createLinearGradient(0, 0, 0, this.height * .75);
        grad.addColorStop(0, '#F3E0E4');
        grad.addColorStop(1, '#300D2C');
        layer.context.fillStyle = grad;
        layer.context.fillRect(0, 0, this.width, this.height * .75);
        return layer;
    }

    createGround() {
        const layer = new Layer(this.width, this.height * .25);
        layer.y = this.height * .75;
        var grad = layer.context.createLinearGradient(0, 0, 0, this.height * .25);
        grad.addColorStop(0, '#300D2C');
        grad.addColorStop(1, '#431AA4');
        layer.context.fillStyle = grad;
        layer.context.fillRect(0, 0, this.width, this.height * .25);
        return layer;
    }

    draw(context, ball) {
        this.sky.drawTo(context, 0, 0);
        this.ground.drawTo(context, 0, this.ground.y);
        this.mountains.forEach(mountain => {
            mountain.draw(context, ball.pos.x + this.width);
        });
        this.horizon.drawTo(context, 0, this.horizon.y);
    }
}