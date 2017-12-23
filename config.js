const path = require('path');


const deckPath = path.join(__dirname, 'decks'); 

var config = {};

config.app_settings = {};

config.app_settings.working_directory = __dirname;
config.app_settings.deck_directory = path.join(config.app_settings.working_directory, 'decks');

module.exports = config;