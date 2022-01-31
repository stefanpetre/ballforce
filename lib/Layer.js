export default class Layer {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');
    }

    drawTo(context, x, y) {
        context.drawImage(
            this.canvas,
            x, y
        );
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
}