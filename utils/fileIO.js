const fs = require('fs');
const path = require('path');


let createNewDeck = function(filePath, fileName, success, error) {
    //check if the file exists, return an error if it does
    var fullPath = path.join(filePath, fileName + '.' + 'srj');
    console.log('filePath');
    console.log(fullPath);
    checkIfFile(fullPath, function(err, isFile) {
        if (isFile) {
            console.log('it\'s a file!!!');
            error();
        } else {
            fs.writeFile(fullPath,'', function(err) {
                if (err) {
                    console.log(err);
                } else {
                    success();
                }
            });
            
        }
    });
}

let getDeckNames = function(filePath,success, error) {
    fs.readdir(filePath, function(err, items) {
        success(items);
    });
}

let checkIfFile = function(file, cb){
    fs.stat(file, function fsStat(err, stats) {
        if (err) {
            if (err.code === 'ENOENT') {
                return cb(null, false);
            } else {
                return cb(err);
            }
        }
        return cb(null, stats.isFile());
    });
}

exports.createNewDeck = createNewDeck;
exports.getDeckNames = getDeckNames;