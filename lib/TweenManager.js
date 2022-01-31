export default class TweenManager {
    constructor() {
        this.tweens = [];
    }

    addTween(tween, draw = false) {
        return new Promise((resolve, reject) => {
            this.tweens.push({
                tween: tween,
                resolve: resolve,
                reject: reject,
                draw: draw
            });
        });
    }

    removeTween(tween) {
        const indx = this.tweens.findIndex(tw => {
            return tw.tween === tween;
        })

        //this.tweens[indx].reject(tween);
        this.tweens.splice(indx, 1);
    }

    update(dt) {
        this.tweens.forEach((tween, indx) => {
            tween.tween.update(dt);
            if (tween.tween.finished) {
                tween.resolve(tween.tween);
                this.tweens.splice(indx, 1);
            }
        });
    }

    draw(context) {
        this.tweens.forEach(tween => {
            if (tween.draw) {
                tween.tween.draw(context);
            }
        });
    }
}