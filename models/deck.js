const config = require('./../config');
const card = require('./card');
const fileIO = require('./../utils/fileIO');
const path = require('path');
const moment = require('moment');
const deckSchema = {
    "id": "/Deck",
    "type":"object",
    "properties": {
        "cards": {
            "type": "array",
            "items": {"$ref":"/Card"}

        }
    },
    "required": []

}

// we also want to define things we can do with a deck here
const createNewDeck = function(working_path, name, success, error) {
    // make sure there isn't a deck already created
    let fileName = path.join(working_path, name + '.srj');
    let deck = {dateCreated: moment().format(), cards: []};
    fileIO.createNewFile(fileName, deck , success, error );

};

const fileNameFromDeckName = function(deckName, working_path) {
    return path.join(working_path, deckName + '.srj');
}

const checkIfDeckExists = function(deckName) {
    var fileName = fileNameFromDeckName(deckName);
    return fileIO.checkIfFile(fileName);
};

const getDeckFilePaths = function(working_directory, success, error) {
    fileIO.getDirectoryContents(working_directory, function(items) {
        var deckFilePaths =items.filter(x => x.endsWith(config.app_settings.file_extension)); 
        success(deckFilePaths);
    }, error);
    
}

const deleteAllDecks = function(working_directory, success, error) {
    getDeckFilePaths(working_directory, function(deckFilePaths) {
        for(let dfp of deckFilePaths) {
            let fullFilePath = path.join(working_directory, dfp);
            fileIO.deleteFile(fullFilePath, function() {
            }, error);
        }
        success([]);
    }, error);
} 

const getTestDirectory = function() {
    return config.app_settings.test_directory;
}

const getTestDeckDirectory = function() {
    return config.app_settings.test_deck_directory
}

const getDeckDirectory = function() {
    return config.app_settings.deck_directory
}

exports.deckSchema = deckSchema;
exports.cardSchema = card.cardSchema;
exports.createNewDeck = createNewDeck;
exports.fileNameFromDeckName = fileNameFromDeckName;
exports.checkIfDeckExists = checkIfDeckExists;
exports.getDeckFilePaths = getDeckFilePaths;
exports.getTestDeckDirectory = getTestDeckDirectory;
exports.getDeckDirectory = getDeckDirectory;
exports.deleteAllDecks = deleteAllDecks;