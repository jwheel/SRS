const config = require('./../config');
const moment = require('moment');
const test_directory = config.app_settings.test_directory
const Validator = require('jsonschema').Validator;
const Rx = require('rxjs');
const array = require('lodash/array');
const math = require('lodash/math');
const random = require('lodash/random');


class Card {

    constructor(question, answer) {
        this.id = 0;
        this.question = question;
        this.answer = answer;
        this.due_date = moment();
        this.create_date = moment();
        this.scores = [];
    }

    pass() {
        const e = 2.718281828;
        this.scores.push(1);
        //we want to add an exponential number of days
        //(e^x)/2 where x is the number of consecutive passes
        const exponent = math.sum(array.takeRightWhile(this.scores, x => x === 1));
        //add a random spread so cards don't clump together
        const numDays = Math.pow(e,exponent)/2.0 + random(-0.99, 0.99);
        //this magic number is used to convert days to earth rotations in terms of seconds
        const numSeconds = numDays*86164;
        
        this.due_date = moment().add(numSeconds, 's');        
    }

    fail() {
        this.scores.push(0);
        this.due_date = moment().add(1, 'days');
        
    }
}

exports.Card = Card;
