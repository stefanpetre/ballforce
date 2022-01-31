import { lerp } from './math.js';

const easings = {
    easeOut(t) {
        return Math.sin(t * Math.PI / 2);
    },
    easeOutStrong(t) {
        return (t == 1) ? 1 : 1 - Math.pow(2, -10 * t);
    },
    easeIn(t) {
        return t * t;
    },
    easeInStrong(t) {
        return (t == 0) ? 0 : Math.pow(2, 10 * (t - 1));
    }
}

export default class Tween {
    constructor(duration, easing) {
        this.duration = duration;
        this.targets = [];
        this.easing = easing;
        this.stopped = false;
    }

    addTarget(subject, properties) {
        const tweenObj = {
            subject: subject,
            duration: properties.duration || this.duration,
            spent: 0,
            easing: properties.easing || this.easing,
            delay: properties.delay || 0,
            finished: false,
            from: properties.from||0,
            to: properties.to||0,
            diff: 0,
            current: properties.from||0
        };
        tweenObj.diff = tweenObj.to - tweenObj.from;
        this.targets.push(tweenObj);
    }

    stop() {
        this.stopped = true;
    }

    get finished() {
        const finished = this.targets.filter(target => !target.finished);
        return finished.length === 0;
    }

    update(dt) {
        if (!this.finished && !this.stopped) {
            this.targets.forEach(target => {
                if (target.delay > 0) {
                    target.delay -= dt;
                    return true;
                }
                target.spent = Math.min(target.spent + dt, target.duration);
                target.normal = target.spent / target.duration;
                if (target.easing) {
                    target.normal = easings[target.easing](target.normal);
                }
                target.current = target.from +  target.diff * target.normal;
                target.finished = target.spent >= target.duration;
                target.subject.update(dt, {
                    current: target.current,
                    normal: target.normal,
                    spent: target.spent
                });
            });
        }
    }

    draw(context) {
        this.targets.forEach(target => {
            target.subject.draw(context);
        });
    }

    destroy() {
        this.targets.length = 0;
    }
}