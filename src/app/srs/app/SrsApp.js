const moment = require('moment');
const _ = require('lodash');
const Rx = require('rxjs');

class SrsApp {

    
    constructor() {
        this.selectedControl = new Rx.Subject();
        this.selectedControl$ = this.selectedControl.asObservable();
        
    }


    changeSelectedControl(controlName) {
        this.selectedControl.next(controlName)
    }

    getDecks() {
        const $this = this;
        return Rx.Observable
        .ajax('api/decks')
        .map(e => e.response);
    }

    renameDeck(oldName, newName) {
        const $this = this;
        return RanRxge.Observable.ajax({
            url:`api/decks/${oldName}/${newName}`,
            method: 'POST',
            body: {}
        })
        .map(e => e.response);
    }

    createNewDeck(name) {
        const $this = this;
        return Rx.Observable.ajax({
            url:`api/decks/${name}`,
            method: 'POST',
            body: {}
        })
        .map(e => e.response);   
    }

    pushItem(array, item) {
        let newArray = [];
        for(let i = 0; i < array.length; i++) {
            newArray.push(array[i]);
        }
        newArray.push(item);
        return newArray;
    }

    getWordList() {
         return Rx.Observable
        .ajax('api/review_list')
        .map(e => e.response);
    }
}

module.exports = SrsApp;