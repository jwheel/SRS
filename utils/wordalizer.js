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
                    //we need to determine what to do based on last containing (P) or (ok)
                    let ok = last.indexOf('(ok)') > 0;
                    let common = last.endsWith('/(P)/');
                    //'common', 'ok', and 'other' buckets

                    if(common) {
                        if(!agg['common'][first]) {
                               agg['common'][first] = [];
                        }
                        agg['common'][first].push(last);
                        
                    }
                    if(ok) {
                        if(!agg['ok'][first]) {
                               agg['ok'][first] = [];
                        }
                        agg['ok'][first].push(last);
                    }
                    if(!ok && !common) {
                        if(!agg['other'][first]) {
                               agg['other'][first] = [];
                        }
                        agg['other'][first].push(last);
                    }
                }
                return agg;
            }, {"common":{},"ok":{},"other":{}});            

            let uw = result.myWords;
            let wordList = uw.reduce(function(agg, elem) {
                let wordDefList = [];

                if(words['common'][elem]) {
                    wordDefList = words['common'][elem];
                }
                if(words['ok'][elem]) {
                    //this condition is so rare that I'm ok if the definition shows up twice. There are two such entries in the entire dictionary. 
                    wordDefList = wordDefList.concat(words['ok'][elem]);
                }
                if(words['other'][elem]) {
                    wordDefList = wordDefList.concat(words['other'][elem]);
                }
                //so now we have a word and a list of definitions and pronunciations
                let wordDefs = wordDefList.map(x => {
                    let defInfo = x;
                    let startIndex = defInfo.indexOf('[');
                    let endIndex = defInfo.indexOf(']');
                    if(startIndex >= 0 && endIndex > startIndex) {
                        let pronunciation = defInfo.substring(startIndex + 1, endIndex);
                        let definition = defInfo.substring(endIndex + 1);
                        let word = elem;
                        
                        return {'pronunciation': pronunciation, 'definition': definition};
                    }
                    return null;
                }).filter(x => { return x;});

                
                agg.push({'word':elem, 'definitions':wordDefs});
                return agg;
            },[]);
            return Rx.Observable.of(wordList.reverse());
        });
}

exports.WodDef = WordDef;
exports.uniqueify = uniqueify;
exports.buildDictionary = buildDictionary;