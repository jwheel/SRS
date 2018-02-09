const assert = require('assert');
const fileIO = require('./../utils/fileIOrxjs');
const AppModel = require('./../models/app');
const DeckModel = require('./../models/deck');
const CardModel = require('./../models/card');
const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const config = require('./../config.js');
const test_directory = config.app_settings.test_deck_directory
const Rx = require('rxjs');
const path = require('path');
const moment = require('moment');



describe('Deck', () => {
    it('Should create a new Deck with correct initialized values', done => {
        let deck = new DeckModel.Deck('test', test_directory);
        assert.equal(deck.name, 'test');
        done();
    });
    
});


let addCardToDeck = function(question, answer, deck) {
    let card = new CardModel.Card();
    card.question = question;
    card.answer = answer;
    deck.addCard(card);
}

let isBetween = function(current, before, after) {
    return current.isAfter(before) &&current.isBefore(after);
}

describe('Deck_addCard', () => {
    it('Should add new instances of cards with unique ids', done => {
        let deck = new DeckModel.Deck('test', test_directory);
        addCardToDeck('question 1','answer 1',deck);
        addCardToDeck('question 2','answer 2',deck);
        addCardToDeck('question 3','answer 3',deck);
        assert.equal(deck.cards[0].id,0 );
        assert.equal(deck.cards[1].id,1 );
        assert.equal(deck.cards[2].id,2 );
        done();
    });
});

describe('Deck_save', () => {
    it('Should save a deck to a file with the same name', done => {
        let deck = new DeckModel.Deck('test', test_directory);
        addCardToDeck('question 1','answer 1',deck);
        addCardToDeck('question 2','answer 2',deck);
        addCardToDeck('question 3','answer 3',deck);
        addCardToDeck('日本語','Japanese',deck);
        deck.save().subscribe(x => {
            done();    
        }, error => {
            console.log(eroror);
        }, 
        () => {
            
        });
        
    });
});


describe('Deck_load', () => {
    it('Should load a deck from a file with the same name', done => {
        let deck = new DeckModel.Deck('test', test_directory);
        addCardToDeck('question 1','answer 1',deck);
        addCardToDeck('question 2','answer 2',deck);
        addCardToDeck('question 3','answer 3',deck);
        addCardToDeck('日本語','Japanese',deck);
        deck.cards[0].pass();
        deck.cards[0].fail();
        deck.cards[0].pass();
        deck.cards[0].pass();
        deck.cards[1].pass();
        deck.cards[1].pass();
        deck.cards[2].pass();
        deck.cards[2].fail();
        deck.save()
        .flatMap(x => {
            return deck.load();
        })
        .subscribe(deckResult => {
            assert.equal(deckResult.name, 'test');
            assert.equal(deckResult.cards[1].id, 1);
            assert.equal(deckResult.cards[0].scores[0],1 );
            assert.equal(deckResult.cards[0].scores[1],0 );
            assert.equal(deckResult.cards[0].scores[2],1 );
            assert.equal(deckResult.cards[0].scores[3],1 );
            done();
        });        
    });
});

describe('Deck_Card_Score_Pass_Fail', () => {
    it('Should save a deck to a file with the same name', done => {
        let deck = new DeckModel.Deck('test', test_directory);
        addCardToDeck('question 1','answer 1',deck);
        addCardToDeck('question 2','answer 2',deck);
        addCardToDeck('question 3','answer 3',deck);
        addCardToDeck('日本語','Japanese',deck);
        const now = moment();
        
        var after = now.clone().add(2, 'd');
        
        deck.cards[0].pass();
        //assert.equal(true, isBetween(deck.cards[0].due_date, now, after));
        deck.cards[0].fail();
        deck.cards[0].pass();
        deck.cards[0].pass();
        deck.cards[1].pass();
        deck.cards[1].pass();
        deck.cards[2].pass();
        deck.cards[2].fail();
        deck.save().subscribe(x => {
            done();    
        });
        
    });
});

describe('Deck_Update', () => {
    it('Should update a card by id. ', done => {
        let deck = new DeckModel.Deck('test', test_directory);
        addCardToDeck('question 1','answer 1',deck);
        addCardToDeck('question 2','answer 2',deck);
        addCardToDeck('question 3','answer 3',deck);
        addCardToDeck('日本語','Japanese',deck);
        deck.save()
        .flatMap(x => {
            return deck.load();
        })
        .flatMap(loadedDeck => {
            loadedDeck.cards[3].question = 'にほんごをはなしますか？';
            return Rx.Observable.of(loadedDeck.updateCard(loadedDeck.cards[3]));
        })
        .flatMap(updateResult => {
            return deck.save();
        })
        .subscribe(finalResult => {
            done();
        });        
    })
});

describe('App_GetDecks', () => {
    it('should return a list of decks for the given directory', done => {
        let app = new AppModel.App();
        app.getDecks(test_directory)
        .subscribe(result => {
            console.log(result);
            
        },
        error => {

        }, () => {
            done();
        })
    });
});
