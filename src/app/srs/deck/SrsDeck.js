var EventEmitter = require('events');
const axios = require('axios');

const _ = require('lodash');


class SrsDeck extends EventEmitter {
    
     constructor() {
        super();
        this._deck = {};
        
    }

    set deck(thisDeck) {
        this._deck = thisDeck;
        this._emitDeckLoad();
    }
    get deck() {
        return this._deck;
    }

    getDeck(name) {
        const $this = this;
        axios.get(`api/decks/${name}`)
        .then(response => {
            $this.deck= JSON.parse(response.data);            
        })
        .catch(error => {
            console.log(error);
        });
    }

    _emitDeckLoad() {
        this.emit('deck-fetched', {
            deck: this.deck
        });
    }

    addCard(deckName, card) {
        const $this = this;

        axios.post(`api/cards`,card)
        .then(response => {
            
        })
        .catch(error => {
            console.log(error);
        })
    }

}

module.exports = SrsDeck;