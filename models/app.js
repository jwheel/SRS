const config = require('./../config');
const Rx = require('rxjs');
const fileIO = require('./../utils/fileIOrxjs');
const path = require('path');

class App {
    constructor() {
        
    }

    getDecks(workingDirectory) {
        return fileIO
        .getDirectoryContents(workingDirectory)
        .flatMap(files => {
            return files
                .filter(x => x.endsWith('.srj'))
                .map(file => file.replace('.srj',''));
        });
    }
}

exports.App = App;