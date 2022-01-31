function radian2degrees(rad) {
    return rad * (180 / Math.PI);
};
function degrees2radian(deg) {
    return deg / (180 / 3.14159);
};

class Vect {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    add(v, dt = 1) {
        this.x += v.x * dt;
        this.y += v.y * dt;
    }
    sub(v, dt = 1) {
        this.x -= v.x * dt;
        this.y -= v.y * dt;
    }
    mult(n) {
        this.x *= n;
        this.y *= n;
    }
    div(n) {
        this.x /= n;
        this.y /= n;
    }
    get mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    set mag(m){
        this.norm();
        this.mult(m);
    }
    norm() {
        this.div(this.mag || 1);
    }
    limit(max) {
        if (this.mag > max) {
            this.div(max);
            this.mult(max);
        }
    }
    rotate(a) {
        var nx = this.x * Math.cos(a) - this.y * Math.sin(a);
        var ny = this.x * Math.sin(a) + this.y * Math.cos(a);
        this.x = nx;
        this.y = ny;
    }
    rotateDeg(a) {
        this.rotate(degrees2radian(a));
    }
    clone() {
        return new Vect(this.x, this.y);
    }
    get angleX(){
        return Math.atan2(this.y, this.x);
    }
    get angleY(){
        return Math.atan2(this.x, this.y);
    }
    get angleXDeg(){
        return Math.abs(Math.round(radian2degrees(Math.atan2(this.y, this.x))));
    }
    get angleYDeg(){
        return Math.abs(Math.round(radian2degrees(Math.atan2(this.x, this.y))));
    }
}

export default Vect;