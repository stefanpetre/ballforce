import Layer from './Layer.js';
import Vect from './Vect.js';
import {
    rand
} from './math.js';

export default class Force extends Layer {
    constructor(pos) {
        super(100,50);
        this.pos = pos;
        this.force = new Vect(0,0);
        this.force.mag = rand(50,200);
        this.force.rotateDeg(rand(360));
        console.log(this.force)
    }
}