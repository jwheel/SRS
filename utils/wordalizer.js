const Rx = require('rxjs');
const _ = require('lodash');
const fileIO = require('./fileIOrxjs');
const path = require('path');
class WordDef {

    constructor(word, reading, baseWord, partOfSpeech) {
        this.word = word;
        this.reading = reading;
        this.baseWord = baseWord;
        this.partOfSpeech = partOfSpeech;
    }
}

let uniqueify = function(fileName) {
    return fileIO.getFileContents(fileName)
    .flatMap(contents => {
        let set = new Set();
        let words = contents.split('\n')
                        .map(line => {
                            let tokens = line.split('\t');
                            if(tokens.length > 3) {
                                let wordDef = new WordDef(tokens[0], tokens[1], tokens[2], tokens[3]);
                                return wordDef;
                            }
                        }).filter(x => {
                            return x;
                        })
                        .map(wordRef => {
                            if(!set.has(wordRef.baseWord)) {
                                set.add(wordRef.baseWord);
                                return wordRef.baseWord;      
                            }
                        })
                        .filter(y => {
                            return y;
                        });
        return Rx.Observable.of(words);
    });
}
class WordListDef {
    constructor(word, pronunciation, def) {
        this.word = word;
        this.pronunciation = pronunciation;
        this.definition = def;
    }
}
let buildDictionary = function(workingDirectory) {
    let fileName = path.join(workingDirectory, 'edict', 'edict_utf-8');
    let uniqueWords = path.join(workingDirectory, 'nihongo.txt');
    
    return fileIO.getFileContents(fileName)
        .flatMap(contents => {
            
            let dictionary = contents.split('\n');
            
            return uniqueify(uniqueWords)
            .flatMap(x => {
                return Rx.Observable.of({'myWords': x, 'dictionary':dictionary })
            });
        })
        .flatMap(result => {
            
            let words = result.dictionary.reduce(function(agg, elem) {
                let startIndex = elem.indexOf('[', 0) - 1;
                if(startIndex > 0) {
                    let first = elem.substring(0,startIndex);
                    let last = elem.substring(startIndex);
                    if(!agg[first]) {
                        agg[first] = last;
                    }                    
                }
                return agg;
            }, );            
            console.log(words[1]);
            let uw = result.myWords;
            let wordList = uw.reduce(function(agg, elem) {
                console.log(`${elem}`);
                if(words[elem]) {
                    //agg[elem] = words[elem];
                }
            }, {});
            return Rx.Observable.of({'words':words[1], 'uw':uw[2]});
        });
}

exports.WodDef = WordDef;
exports.uniqueify = uniqueify;
exports.buildDictionary = buildDictionary;