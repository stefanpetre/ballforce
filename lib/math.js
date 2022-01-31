export function norm(val, min, max){
    return (val-min)/(max-min);
}

export function lerp(nrm, min, max) {
    return (max-min) * nrm + min;
}

export function map(val, sMin, sMax, dMin, dMax) {
    return lerp(norm(val, sMin, sMax), dMin, dMax);
}

export function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

export function rand(min, max) {
    if (!max) {
        max = min;
        min = 0;
    }
    return Math.floor(Math.random() * (max - min)) + min;
}

export function round(val, dec=0) {
    const mult = 10 * dec;
    return Math.round(val * mult)/mult;
}