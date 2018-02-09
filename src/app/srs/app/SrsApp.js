var EventEmitter = require('events');
const axios = require('axios');

const moment = require('moment');
const _ = require('lodash');
class SrsApp extends EventEmitter {

    constructor() {
        super();

        this._selectedControl = 'deck-list';
        this._decks = [];
        
    }


    set decks(deckList) {
        this._decks = deckList;
        this._emitDeckLoad();
    }
    get decks() {
        return this._decks;
    }

    set selectedControl(newSelectedControl) {
        this._selectedControl = newSelectedControl;
        this._emitChange();
    }

    get selectedControl() {
        return this._selectedControl;
    }

    
    _emitChange() {
        this.emit('change', {
            selectedControl: this.selectedControl
        });
    }

    _emitDeckLoad() {
        this.emit('decks-fetched', {
            decks: this.decks
        });
    }

    getDecks() {
        const $this = this;
        axios.get('api/decks')
        .then(response => {
            $this.decks = response.data.decks;            
        })
        .catch(error => {
            console.log(error);
        });
    }

    renameDeck(oldName, newName) {
        const $this = this;
        axios.post(`api/decks/${oldName}/${newName}`)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });
    }

    createNewDeck(name) {
        const $this = this;
        axios.post(`api/decks/${name}`)
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.log(err);
        });
    }

    pushItem(array, item) {
        let newArray = [];
        for(let i = 0; i < array.length; i++) {
            newArray.push(array[i]);
        }
        newArray.push(item);
        return newArray;
    }

    cloneDeep(deck) {
        return _.cloneDeep(deck);
    }
}

module.exports = SrsApp;