'use strict';
const config = require('./../config');
const CardModel = require('./card');
const fileIO = require('./../utils/fileIOrxjs');
const path = require('path');
const moment = require('moment');
const test_directory = config.app_settings.test_directory


const Rx = require('rxjs');
class Deck {

    constructor(name, directory) {
        this.name = name;
        this.cards = [];        
        this.working_directory = directory;
    }

    getFileName() {        
        const fileName = path.join(this.working_directory, this.name + '.srj');
        return fileName;
    }

    save() {
        
        return fileIO.writeJsonToFile(this.getFileName(), this);        
    }

    load() {
        return fileIO.getFileContents(this.getFileName())
        .flatMap(x => {
            const deck = JSON.parse(x);
            this.name = deck.name;
            for(let i = 0; i < deck.cards.length;i++) {
                let card = new CardModel.Card();
                let cc = deck.cards[i];
                
                card.id = cc.id;
                card.question = cc.question;
                card.answer = cc.answer;
                card.due_date = cc.due_date;
                card.create_date = cc.create_date;
                card.scores = cc.scores;
                this.cards.push(card);
            }
            this.working_directory = deck.working_directory;
            return Rx.Observable.of(this);
        });
    }

    addCard(card) {
        //the id from a newly added card is assumed to be 0
        let candidateCard = new CardModel.Card();
        if(this.cards.length > 0) {
            const lastCard = this.cards[this.cards.length - 1];
            candidateCard.id = lastCard.id + 1;            
        }
        candidateCard.question = card.question;
        candidateCard.answer = card.answer;
        this.cards.push(candidateCard);
        return card;
    }

    updateCard(card) {
        let candidateCard = this.cards.find(x => x.id === card.id);
        candidateCard.question = card.question;
        candidateCard.answer = card.answer;
        return candidateCard;
    }

    renameDeck(oldName, newName, directory) {
        
        let oldPath = path.join(directory, oldName + '.srj');
        let newPath = path.join(directory,newName + '.srj');
        let $this = this;
        return fileIO.renameFile(oldPath, newPath)
        .flatMap(result => {
            $this.name = newName;     
            return Rx.Observable.of(this);       
        });
    }

    getQuestionText() {

        return this.cards.slice()
        .sort(function(a,b) {
            if(a.due_date < b.due_date) {
                return -1;
            }
            if(a.due_date > b.due_date) {
                return 1
            }
            return 0;
        })
        .reverse()
        .map(x => x.question)
        .join('\n');
    }

    writeQuestionFile() {
        let fileName = this.name + ".ql";
        let questionContents = this.getQuestionText();
        let filePath = path.join(this.working_directory, fileName);
        return fileIO.writeContentsToFile(filePath, questionContents);
    }
}





exports.Deck = Deck;
exports.cardSchema = CardModel.cardSchema;
