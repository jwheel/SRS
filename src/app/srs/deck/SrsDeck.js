
const _ = require('lodash');
const Rx = require('rxjs');


class SrsDeck {
    
    constructor() {

    }

    getDeck(name) {
        const $this = this;
         return Rx.Observable
        .ajax(`api/decks/${name}`)
        .map(e => {
            return JSON.parse(e.response);
        });
    }

    addCard(deckName, card) {
        const $this = this;
         return Rx.Observable.ajax({
            url:`api/cards`,
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',                
            },
            body: {
                deckName:deckName,
                card:card}
        })
        .map(e => e.response);        
    }

    passCard(deckName, card) {
        const $this = this;
         return Rx.Observable.ajax({
            url:`api/cards/${card.id}/1`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',                
                },
            body: {
                deckName:deckName,
            }
        })
        .map(e => e.response);
    }

    failCard(deckName, card) {
        const $this = this;
         return Rx.Observable.ajax({
            url:`api/cards/${card.id}/0`,
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',                
            },
            body: {
                deckName:deckName,
            }
        })
        .map(e => e.response);
    }

    getDueDateHistogram(deckName) {
        return Rx.Observable
        .ajax(`api/statistics/histogram/${deckName}`)
        .map(e => {
            return e.response;
        });
    }
}

module.exports = SrsDeck;