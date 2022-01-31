import Layer from './Layer.js';
import {roundRect} from './canvas.js';

export default class Score {
    constructor(width, height) {
        this.score = 0;
        this.width = 200;
        this.height = 60;
        this.padding = 10;
        this.background = new Layer(300,80);
        
        this.background.context.shadowColor = '#FDD0F8';
        this.background.context.shadowBlur = 10;
        this.background.context.strokeStyle = '#FDD0F8';
        this.background.context.lineWidth = 2;
        roundRect(this.background.context,this.padding,this.padding,this.width - this.padding*2,this.height - this.padding*2, this.padding);
        this.background.context.stroke();
        this.x = (width - this.width)/2;
        this.y = (height - this.height)/3;
    }

    draw(context, ball) {
        this.score = Math.round(ball.pos.x/10);
        this.background.drawTo(context, this.x, this.y);
        context.save();
        context.font = '30px sans-serif';
        context.fillStyle = '#FDD0F8';
        context.shadowColor = '#FDD0F8';
        context.shadowBlur = this.height/2;
        context.textAlign = 'center';
        context.fillText(this.score, this.x + this.width/2, this.y + this.height/2 + this.padding, 260);
        context.restore();
    }
}