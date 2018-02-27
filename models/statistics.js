'use strict';
const config = require('./../config');
const CardModel = require('./card');
const DeckModel = require('./deck');
const path = require('path');
const Rx = require('rxjs');
const moment = require('moment');
const test_directory = config.app_settings.test_directory
const _ = require('lodash');

class Statistics {

    constructor() {

    }

    getDueDateHistogram(deckName, directory) {
        directory = directory || config.app_settings.deck_directory;
        const days = _.range(364).map(x => new moment().startOf('year').add(x, 'd'));

        const histogram = [];

        let deck = new DeckModel.Deck(deckName, directory);
        return deck.load()
        .flatMap(thisDeck => {
            days.forEach(day => {
                let nextDay = day.clone().add(1,'d');
                let numCardsDue = thisDeck.cards
                .filter(x => { 
                    let due_date = new moment(x.due_date);
                    return due_date.isBetween(day, nextDay, 'ms');
                                }).length;
                let display = day.format('YYYY-MM-DD')
                histogram.push({due_date:display, cards_due:numCardsDue});
            });
            
            return Rx.Observable.of(histogram);
        });
    }
}

exports.Statistics = Statistics;