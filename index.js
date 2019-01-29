'use strict';

var Color = require('color');

function diff(A, B) {
    var a = A.rgb().array();
    var b = B.rgb().array();
    return Math.sqrt([
        Math.pow(a[0] - b[0], 2),
        Math.pow(a[1] - b[1], 2),
        Math.pow(a[2] - b[2], 2)
    ].reduce(function(prev, current) {
        return prev + current;
    }, 0));
}

function find(A, B, from, to, func) {
    var steps = 0;
    var min = from;
    var max = to;
    console.log('find', A.hex(), B.hex());
    while(steps < 15) {

        console.log('=========\nmin/max', min, max);
        var aColor = func(A, min);
        var bColor = func(A, max);
        var a = diff(aColor, B);
        var b = diff(bColor, B);

        console.log('A', aColor.hex(), a);
        console.log('B', bColor.hex(), b);
        var distance = Math.abs(max - min);
        if (a < b) {
            console.log('go down');
            max = min + (distance / 2)
        } else {
            console.log('go up');
            min = min + (distance / 2)
        }
        steps++;
    }
    var result = min + (distance / 2);
    console.log('========\nsuggest', func(A, result).hex());
    return result;
}

function lightFunction(color, step) {
    if (step > 0) {

        var result = color.lighten(step);
        console.log('lighten', color.hex(), 'by ', step, result.hex());
        return result;
    } else if (step < 0) {
        var result = color.darken(-step);
        console.log('darken', color.hex(), 'by ', -step, result.hex());
        return result;
    } else {
        return color;
    }
}

function saturationFunction(color, step) {
    var result = color.saturate(step);
    console.log('saturate', color.hex(), 'by ', step, result.hex());
    return result;
}

module.exports = function(baseColor, destinationColor) {
    var base = Color(baseColor);
    var destination = Color(destinationColor);

    var light = find(base, destination, 0, 1, lightFunction);
    var dark = find(base, destination, -1, 0, lightFunction);

    var lightValue = lightFunction(base, light);
    var darkValue = lightFunction(base, dark);

    var brightness;
    var next;

    if (diff(lightValue, destination) > diff(darkValue, destination)) {
        next = darkValue;
        brightness = dark;
    } else {
        next = lightValue;
        brightness = light;
    }

    var full = find(next, destination, 0, 1, saturationFunction);
    var bleak = find(next, destination, -1, 0, saturationFunction);

    var saturation;

    var fullValue = saturationFunction(next, full);
    var bleakValue = saturationFunction(next, bleak);

    if (diff(fullValue, destination) > diff(bleakValue, destination)) {
        saturation = full;
    } else {
        saturation = bleak;
    }

    return [brightness, saturation];
};
