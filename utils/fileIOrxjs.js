const fs = require('fs');
const Rx = require('rxjs');
const rimraf = require('rimraf');

let isFile = function(file) {
    let checkFile$ = Rx.Observable.bindNodeCallback(fs.stat);
    
    return checkFile$(file)
    .mergeMap(result => {
        return Rx.Observable.of(result.isFile());
    })
    .catch(error => {
        if(error.code === 'ENOENT' || error.code === 'ENOTDIR') {
            return Rx.Observable.of(false);
        } else {
            throw error;
        }        
    });    
};

let isDirectory = function(filePath) {
    let isDirectory$ = Rx.Observable.bindNodeCallback(fs.stat);
    
    return isDirectory$(filePath)
    .mergeMap((result,error) => {
        return Rx.Observable.of(result.isDirectory());
    })
    .catch(error => {
        if(error.code === 'ENOENT' || error.code === 'ENOTDIR' || error.code === 'EPERM') {
            return Rx.Observable.of(false);
        } else {
            throw error;
        }        
    });
};

let replacer = function(key, value) {
    if(key === 'scores' && typeof(value) === 'object') {
        return "[" + value.join() + "]";
    }
    return value;
}
let writeJsonToFile = function(filePath, contents) {
    let writeToFile$ = Rx.Observable.bindNodeCallback(fs.writeFile)
    var jsonContents = JSON.stringify(contents, replacer,1).replace(/"\[/g,"[").replace(/\]"/g,"]");
    return writeToFile$(filePath, jsonContents);
};

let writeContentsToFile = function(filePath, contents) {
    let writeToFile$ = Rx.Observable.bindNodeCallback(fs.writeFile)
    return writeToFile$(filePath, contents);
}

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

let deleteFile = function(filePath) {
    let unlink$ = Rx.Observable.bindNodeCallback(fs.unlink);
    return unlink$(filePath);
};

let getFileContents = function(filePath) {
    let readFile$ = Rx.Observable.bindNodeCallback(fs.readFile);
    return readFile$(filePath,  {encoding: "utf8"});
};

let getDirectoryContents = function(filePath) {    
    let getDirContents = Rx.Observable.bindNodeCallback(fs.readdir);
    return getDirContents(filePath);
};

exports.isFile = isFile;
exports.isDirectory = isDirectory;
exports.writeJsonToFile = writeJsonToFile;
exports.writeContentsToFile = writeContentsToFile;
exports.createNewDirectory = createNewDirectory;
exports.deleteDirectory = deleteDirectory;
exports.deleteFile = deleteFile;
exports.getDirectoryContents = getDirectoryContents;
exports.getFileContents = getFileContents;
