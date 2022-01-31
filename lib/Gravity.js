//https://codepen.io/forrestbe/pen/KNMvPw

import {clamp} from './math.js';

export default class Gravity {

    constructor(pos, mass, gravity) {
        this.pos = pos;
        this.mass = mass;
        this.gravity = gravity;
    }

    attraction(particle) {
        // Calculate the direction of the force
        const force = this.pos.clone();
        force.x = particle.pos.x;
        force.sub(particle.pos);

        // Distance between objects
        const distance = clamp(force.mag, 5, 25);
        //const distance = Math.max(5, force.mag);
        force.norm();
        const strength = (this.gravity * this.mass * particle.mass)/(distance * distance);
        force.mult(strength);
        return force;
    }

    draw(context) {
        context.fillStyle = '#f00';
        context.beginPath();
        context.arc(
                this.pos.x,
                this.pos.y,
                this.mass/2 ,
                0, 2 * Math.PI, false);
        context.fill();
    }
}
