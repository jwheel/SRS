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
const working_path = config.app_settings.deck_directory;
// we also want to define things we can do with a deck here
const createNewDeck = function(name, success, error) {
    // make sure there isn't a deck already created
    let fileName = path.join(working_path, name + '.srj');
    let deck = {dateCreated: moment().format(), cards: []};
    fileIO.createNewFile(fileName, deck , success, error );

};


exports.deckSchema = deckSchema;
exports.cardSchema = card.cardSchema;
exports.createNewDeck = createNewDeck;