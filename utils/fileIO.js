const fs = require('fs');
const path = require('path');


let createNewFile = function(filePath,contents, success, error) {
    //check if the file exists, return an error if it does
    
    checkIfFile(filePath, function(err, isFile) {
        if (isFile) {
            error();
        } else {
            fs.writeFile(filePath,JSON.stringify(contents, null, 2), function(err) {
                if (err) {
                    console.log(err);
                } else {
                    success();
                }
            });
            
        }
    });
}

let createNewDirectory = function(filePath,success, error ) {
    checkIfDirectory(filePath, function(err, isDirectory) {
        if (isDirectory) {
            error();
        } else {
            fs.mkdir(filePath, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    success();
                }
            });
        }
    });
}


let deleteDirectory = function(path, callback) {
	fs.readdir(path, function(err, files) {
		if(err) {
			// Pass the error on to callback
			callback(err, []);
			return;
		}
		let wait = files.length,
			count = 0,
			folderDone = function(err) {
			count++;
			// If we cleaned out all the files, continue
			if( count >= wait || err) {
				fs.rmdir(path,callback);
			}
		};
		// Empty directory to bail early
		if(!wait) {
			folderDone();
			return;
		}
		
		// Remove one or more trailing slash to keep from doubling up
		path = path.replace(/\/+$/,"");
		files.forEach(function(file) {
			let curPath = path + "/" + file;
			fs.lstat(curPath, function(err, stats) {
				if( err ) {
					callback(err, []);
					return;
				}
				if( stats.isDirectory() ) {
					deleteDirectory(curPath, folderDone);
				} else {
					fs.unlink(curPath, folderDone);
				}
			});
		});
	});
};

let checkIfDirectory = function(filePath, cb) {
    fs.stat(filePath, function(err, stats) {
        if(err) {
            if(err.code == 'ENOENT') {
                return cb(null, false)
            }
            else if(err.code == 'ENOTDIR') {
                return cb(null, false);
            }
            else {
                return cb(err);
            }
        }
        return cb(null, stats.isDirectory());        
    });
}

let getDirectoryContents = function(filePath,success, error) {
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


exports.deleteDirectory = deleteDirectory;
exports.createNewFile = createNewFile;
exports.createNewDirectory = createNewDirectory;
exports.checkIfDirectory = checkIfDirectory;
exports.checkIfFile = checkIfFile;
exports.getDirectoryContents = getDirectoryContents;