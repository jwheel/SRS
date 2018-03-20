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
        
        const days = _.range(364).map(x => (new moment().startOf('year').add(x, 'd')).format('YYYY-MM-DD'));
        let rawHist = {};
        days.forEach(x => {
            rawHist[x] = 0;
        })
        let deck = new DeckModel.Deck(deckName, directory);
        return deck.load()
        .flatMap(thisDeck => {
            let cards = thisDeck.cards;
            cards.forEach(function(element) {
                let due_date = (new moment(element.due_date)).format('YYYY-MM-DD');
                rawHist[due_date] ? rawHist[due_date]++ : rawHist[due_date] = 1;                
            }, this);
            let histogram = Object.keys(rawHist).map(x => {
                return {'due_date':x,'cards_due':rawHist[x]};
            });
            return Rx.Observable.of(histogram);
        });
    }
}

exports.Statistics = Statistics;