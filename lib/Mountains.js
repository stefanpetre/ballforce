import Layer from './Layer.js';
import {
    rand
} from './math.js';
import {
    noise
} from './noise.js';

const maxMountains = 10;

export default class Mountains {
    constructor(x, y, width, height, offset, coeficient = 1, background = '#300D2C', blur) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.maxWidth = width * maxMountains * 2;
        this.height = height;
        this.offset = offset;
        this.coeficient = coeficient;
        this.background = background;
        this.blur = blur;
        this.container = new Layer(this.width, this.height);
        this.layers = [];
        for (let i = 0; i < maxMountains; i++) {
            this.addLayer(i);
        }
        for (let i = 0; i < maxMountains; i++) {
            this.copyLayer(i + maxMountains, maxMountains - i - 1);
        }
    }

    posToIndx(pos) {
        if (pos< 0) {
            pos += this.maxWidth;
        }

        return Math.floor((Math.max(0, pos % this.maxWidth)) / this.width);
    }

    getVisibleLayers(pos) {
        pos *= this.coeficient;
        let last = [];
        const visible = [];

        [
            this.posToIndx(pos - this.width),
            this.posToIndx(pos),
            this.posToIndx(pos + this.width)
        ].forEach((layerIndex, indx) => {
           last.push(layerIndex);
            visible.push({
                offset: -(pos % this.maxWidth) % this.width + this.width * (indx-1),
                layer: this.layers[layerIndex]
            });
        });

        return visible;
    }

    copyLayer(indx, fromIndx) {
        const layer = new Layer(this.width, this.height);
        layer.context.fillStyle = 'red';
        layer.context.fillText('Layer: ' + indx, 0, 20);
        layer.y = indx * this.width;
        layer.context.scale(-1, 1);
        layer.context.drawImage(this.layers[fromIndx].canvas, -this.width, 0);
        this.layers[indx] = layer;
    }

    addLayer(indx) {
        const layer = new Layer(this.width, this.height);
        layer.context.fillStyle = 'green';
        layer.context.fillText('Layer: ' + indx, 0, 20);
        layer.y = indx * this.width;
        this.drawLayer(layer, indx > 0 ? this.layers[indx - 1].lastPeak : false);
        this.layers[indx] = layer;
    }

    drawLayer(layer, lastPeak) {
        let noPeaks = rand(100, 500);
        const width = this.width / noPeaks;
        let pos = 0;
        layer.context.beginPath();
        if (lastPeak === false) {
            lastPeak = noise(0) * layer.height;
        }
        layer.context.moveTo(0, lastPeak);
        //layer.context.lineTo(0, lastPeak);
        //layer.context.lineWidth = 2;
        //layer.context.strokeStyle = '#9C7896';
        //layer.context.shadowColor = '#9C7896';
        //layer.context.shadowBlur = 20;
        var grad = layer.context.createLinearGradient(0, 0, 0, layer.height);
        grad.addColorStop(1, this.background);
        grad.addColorStop(0, '#000');
        layer.context.fillStyle = grad;
        while (noPeaks > 0) {
            noPeaks -= 1;
            pos += width;
            lastPeak = noise((layer.y + pos) / 100 * this.coeficient) * layer.height;
            layer.context.lineTo(pos, lastPeak);
        }
        lastPeak = noise((layer.y + this.width) / 100 * this.coeficient) * layer.height;
        layer.context.lineTo(this.width, lastPeak);
        //layer.context.lineTo(this.width + 10, lastPeak);
        layer.context.lineTo(this.width, this.height);
        layer.context.lineTo(0, this.height);
        //layer.context.lineTo(-10, this.height);
        layer.context.fill();
        //layer.context.stroke();

        layer.lastPeak = lastPeak;
    }

    draw(context, pos) {
        this.container.clear();
        this.getVisibleLayers(pos).forEach(visible => {
            visible.layer.drawTo(this.container.context, visible.offset, 0);
        });
        /*if (this.blur) {
            this.container.context.filter = 'blur('+this.blur+'px)';
        }*/
        this.container.drawTo(context, this.x, this.y);
    }
}