// https://github.com/orbitbot/henderson

function ITE(prev, next) {
    var error = Error.call(this, 'Transition from ' + prev + ' to ' + next + ' is not allowed');
    error.name = 'IllegalTransitionException';
    error.prev = prev;
    error.attempt = next;
    return error;
}

export default class State {
    constructor(config) {
        this.events = {};
        this.transitions = config.states;
        this.current = config.initial;
    }

    on(ev, fn) {
        this.events[ev] = this.events[ev] || [];
        this.events[ev] = this.events[ev].concat(fn);
    }


    off(ev, fn) {
        if (this.events[ev]) {
            const indx = this.events[ev].indexOf(fn);
            if (indx < -1) {
                return;
            }
            this.events[ev].splice(indx, 1);
        }
    }

    getCbs(key) {
        return this.events[key] || [];
    }

    go(next) {
        const prev = this.current;
        var params = Array.prototype.slice.call(arguments, 1);

        if (this.transitions[prev].indexOf(next) < 0) {
            return Promise.reject(new ITE(prev, next));
        }

        var after = this.getCbs('after:' + prev);
        var pre = this.getCbs('before:' + next);
        var on = this.getCbs(next);
        var post = this.getCbs('*');

        var beforePost = after.concat(pre, on);

        function getPrefix(index) {
            return (index < after.length ? [next] : index < beforePost.length ? [prev] : [prev, next]);
        }

        var stateChange = after.length + pre.length;
        
        const all = beforePost.concat(post, function ensureStateChange() { });

        return all.reduce((series, task, index) => {
                var args = getPrefix(index).concat(params);
                return series.then(() => {
                    if (index === stateChange) {
                        this.current = next;
                    }

                    return task.apply(task, args);
                });
            }, Promise.resolve());
    }
}