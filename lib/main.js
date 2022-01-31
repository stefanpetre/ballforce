import GameTimer from './Timer.js';
import State from './State.js';
import Stage from './Stage.js';

async function start() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    const stage = new Stage(canvas.width, canvas.height);

    const timerOptions={
        update: (dt, tc) => {
            stage.update(dt);
        },
        render: () => {
            stage.draw(context);
            context.fillText('Running', 0, canvas.height - 20);
        },
    };

    const timer = GameTimer(timerOptions);

    timer.start();

    canvas.addEventListener('click', function(){
        if (timer.running()) {
            context.fillText('Stopped', 0, canvas.height - 20);
            timer.stop();
        } else {
            timer.start();
        }
    });

}

start();