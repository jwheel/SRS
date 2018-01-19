const fs = require('fs');
const Rx = require('rxjs');
const rimraf = require('rimraf');

let isFile = function(file) {
    let checkFile$ = Rx.Observable.bindNodeCallback(fs.stat);
    
    return checkFile$(file).mergeMap(result => {
        return Rx.Observable.of(result.isFile());
    });    
};

let isDirectory = function(filePath) {
    let isDirectory$ = Rx.Observable.bindNodeCallback(fs.stat);
    
    return isDirectory$(filePath)
    .mergeMap((result,error) => {
        return Rx.Observable.of(result.isDirectory());
    })
    .catch(error => {
        if(error.code === 'ENOENT' || error.code === 'ENOTDIR') {
            return Rx.Observable.of(false);
        } else {
            throw error;
        }        
    });
};

let createNewFile = function(filePath, contents) {
    let createNewFile$ = Rx.Observable.bindNodeCallback(fs.writeFile)
    
    return checkIfFile(filePath).mergeMap(isFile => {
        if(isFile) {
           Rx.Observable.throw(new Error('File already exists: ' + filePath));
        } else {
            var jsonContents = JSON.stringify(contents, null, 2);
            return createNewFile$(filePath, jsonContents);
        }
    });
};

let createNewDirectory = function(filePath) {
    let createNewDirectory$ = Rx.Observable.bindNodeCallback(fs.mkdir);

    return isDirectory(filePath).mergeMap(isDirectory => {
        if(isDirectory) {
            Rx.Observable.throw(new Error('Directory already exists'));
        }
        return createNewDirectory$(filePath);
    });
};

let deleteDirectory = function(directory) {
    let rimraf$ = Rx.Observable.bindCallback(rimraf);
    return rimraf$(directory);    
};

let getDirectoryContents = function(filePath) {
    let getDirContents = Rx.Observable.bindNodeCallback(fs.readdir);
    return getDirContents(filePath);
};

exports.isFile = isFile;
exports.isDirectory = isDirectory;
exports.createNewFile = createNewFile;
exports.createNewDirectory = createNewDirectory;
exports.deleteDirectory = deleteDirectory;
exports.getDirectoryContents = getDirectoryContents;
