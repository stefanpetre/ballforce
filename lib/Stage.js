import Background from "./Background.js";
import Ball from "./Ball.js";
import Vect from "./Vect.js";
import Gravity from "./Gravity.js";
import Forces from "./Forces.js";
import Score from "./Score.js";

class Stage {

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.background = new Background(width, height);
        this.gravity = new Gravity(new Vect(0, height), 1000, 8);
        this.forces = new Forces(width);
        this.ball = new Ball(10, 300, 20, 1);
        this.ball.applyForce(new Vect(1000,-800));
        this.scrore = new Score(width, height);
    }

    setState(state) {
        this.state = state;
    }

    update(dt) {
        //this.tm.update(dt);
        const gravityForce = this.gravity.attraction(this.ball);
        this.ball.update(dt, gravityForce, this);
        this.forces.update(dt, this.ball);
    }

    draw(context) {
        this.background.draw(context, this.ball);
        this.ball.draw(context, this);
        this.forces.draw(context, this.ball);
        this.scrore.draw(context, this.ball);
    }
}

export default Stage;