import {
    rand,
    map
} from './math.js';
import Layer from './Layer.js';
import Vect from './Vect.js';
import Tween from './Tween.js';
import TweenManager from './TweenManager.js';
import {
    roundRect
} from './canvas.js';

const forceSize = {
    width: 40,
    height: 40,
};
const forceAmp = {
    min: 200,
    max: 1000
};
const forceTypes = [180, 225, 359, 0, 45, 90, 135, 180, 225, 359];
const surface = 420;
const forceIcons = {};

class ForceIcon extends Layer {
    constructor(vect) {
        super(15, 30);
        this.context.strokeStyle = '#FDD0F8';
        this.context.lineWidth = map(vect.mag, forceAmp.min, forceAmp.max, 1, 8);
        this.context.lineCap = 'round';
        this.context.beginPath();
        this.context.moveTo(5, 5);
        this.context.lineTo(10, 15);
        this.context.lineTo(5, 25);
        this.context.stroke();
        forceIcons[this.context.lineWidth] = this;
    }
}

class Force extends Layer {
    constructor(pos) {
        super(forceSize.width, forceSize.height);
        this.pos = pos;
        this.vect = new Vect(0, 1);
        this.vect.mag = rand(forceAmp.min, forceAmp.max);
        this.vect.rotateDeg(forceTypes[rand(forceTypes.length)]);
        const mag = map(this.vect.mag, forceAmp.min, forceAmp.max, 1, 8);
        this.icon = forceIcons[mag] || new ForceIcon(this.vect);
        this.blur = 0;
        this.draw();
    }
    get right() {
        return this.pos + forceSize.width;
    }
    draw() {
        this.clear();
        this.context.save();
        this.context.translate(forceSize.width / 2, forceSize.height / 2);
        this.context.rotate(this.vect.angleX);
        this.icon.drawTo(this.context, -this.icon.width / 2, -this.icon.height / 2);
        this.context.restore();

        this.context.shadowColor = '#fff';
        this.context.shadowBlur = this.blur;

        this.context.strokeStyle = '#B097A5';
        this.context.lineWidth = 1;
        roundRect(this.context, 0, 0, this.canvas.width, this.canvas.height, 10);
        this.context.stroke();
    }
    update(dt, tw) {
        this.blur = parseInt(tw.current);
    }
}

class ForcesGroup extends Layer {
    constructor(width, indx, forces = 0) {
        super(width, forceSize.height);
        this.pos = width * indx;
        this.forces = [];
        while (this.forces.length < forces) {
            const pos = rand(width - forceSize.width);
            let isOverlapping = false;
            this.forces.forEach(force => {
                if (!(force.pos > pos + forceSize.width || force.pos + forceSize.width < pos)) {
                    isOverlapping = true;
                }
            });
            if (!isOverlapping) {
                const force = new Force(pos);
                this.forces.push(force);
            }
        }
        /*this.context.strokeStyle = '#B097A5';
        this.context.strokeRect(0, 0, 2, this.canvas.height );*/
        this.tm = new TweenManager();
        this.hasToDraw = true;
    }
    draw(context, x, y) {
        if (this.hasToDraw) {
            this.clear();
            this.forces.forEach(force => {
                force.draw();
                force.drawTo(this.context, force.pos, 0);
            });
            if (this.tm.tweens.length === 0) {
                this.hasToDraw = false;
            }
        }
        this.drawTo(context, x, y);
    }
    update(dt, ball, ballCenter, ballBottom, surface) {
        if (ballBottom === surface) {
            this.forces.forEach(force => {
                if (ballCenter >= (force.pos + this.pos) && ballCenter <= (force.right + this.pos)) {
                    ball.applyForce(force.vect);
                    const tw = new Tween(1, 'easeOut');
                    tw.addTarget(force, {
                        from: 20,
                        to: 0
                    });
                    this.tm.addTween(tw);
                }
            });
        }
        this.tm.update(dt);
        if (this.tm.tweens.length > 0) {
            this.hasToDraw = true;
        }
    }
}

const maxForcesGroups = 20;
const forcesPerGroup = 6;

export default class Forces {
    constructor(width) {
        this.width = width;
        this.maxWidth = width * (maxForcesGroups-1);
        this.layers = [];
        for (let i = 0; i < maxForcesGroups; i++) {
            this.addLayer(i, i < 2 ? 0 : rand(forcesPerGroup));
        }
    }

    posToIndx(pos) {
        return Math.floor(pos % this.maxWidth / this.width) + 1;
    }

    getVisibleLayers(pos) {
        const visible = [];
        [
            this.posToIndx(pos - this.width),
            this.posToIndx(pos),
            this.posToIndx(pos + this.width)
        ].forEach((layerIndex, indx) => {
            visible.push({
                offset: -pos % this.width + this.width * (indx - 1),
                layer: this.layers[layerIndex],
                indx: layerIndex
            });
        });

        return visible;
    }

    addLayer(indx, forces) {
        const layer = new ForcesGroup(this.width, indx - 1, forces);
        this.layers[indx] = layer;
    }

    update(dt, ball) {
        if (ball.stopped) {
            return;
        }
        const ballBottom = ball.pos.y + ball.radius;
        const ballCenter = ball.pos.x % this.maxWidth + ball.radius;
        this.getVisibleLayers(ball.pos.x).forEach(visible => {
                visible.layer.update(dt, ball, ballCenter, ballBottom, surface);
        });
    }

    draw(context, ball) {
        this.getVisibleLayers(ball.pos.x).forEach(visible => {
            visible.layer.draw(context, visible.offset + 200, surface);
        });
    }
}