var assert = require('assert');
var color = require('./index');

describe('color-guess', function() {
    it('work as expected', function() {
        // requires just light
        console.log(color('#DFE8F6', '#CDDBF1'));
        // with saturation
        console.log(color('#DFE8F6', '#CFD9EA'));
    });
});
