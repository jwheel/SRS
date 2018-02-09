// Polyfill to support native ES6 promises
var SrsDeck = require('./SrsDeck');

module.exports = window.deck = new SrsDeck();