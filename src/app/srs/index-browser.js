// Polyfill to support native ES6 promises
var SrsApp = require('./SrsApp');

module.exports = window.app = new SrsApp();