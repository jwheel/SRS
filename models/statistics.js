'use strict';
const config = require('./../config');
const CardModel = require('./card');
const DeckModel = require('./deck');
const path = require('path');
const Rx = require('rxjs');
const moment = require('moment');
const test_directory = config.app_settings.test_directory
const _ = require('lodash');

const Rx = require('rxjs');

class Statistics {

    constructor() {

    }

    getDueDateHistogram(deckName, directory) {
        directory = directory || config.app_settings.deck_directory;
        const days = _.range(364).map(x => new moment().startOf(year).add(x, 'd'));

        const histogram = [];

        let deck = new DeckModel.Deck(deckName, directory);
        return deck.load()
        .flatMap(thisDeck => {
            days.forEach(day => {
                nextDay = day.clone().add(1,'d');
                let numCardsDue = thisDeck.cards
                .filter(x => { x.due_date.isBetween(day, nextDay, 'ms')
                                }).length;
                histogram.push({day:day, numCardsDue:numCardsDue});
            });
            console.log(histogram);
            return Rx.Observable.of(histogram);
        });
    }
}

exports.Statistics = Statistics;