const card = require('./card');

var deckSchema = {
    "id": "/Deck",
    "type":"object",
    "properties": {
        "id": {"type":"number"},
        "cards": {
            "type": "array",
            "items": {"$ref":"/Card"}

        }
    },
    "required": ["id"]

}

exports.deckSchema = deckSchema;
exports.cardSchema = card.cardSchema;