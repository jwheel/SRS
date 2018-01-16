const path = require('path');


var config = {};

config.app_settings = {};

config.app_settings.file_extension = '.srj';
config.app_settings.working_directory = __dirname;
config.app_settings.test_directory = path.join( __dirname, 'tests');
config.app_settings.deck_directory = path.join(config.app_settings.working_directory, 'decks');
config.app_settings.test_deck_directory = path.join(config.app_settings.test_directory, 'decks');
module.exports = config;