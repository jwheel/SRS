const assert = require('assert');
const path = require('path');
const fileIO = require('./../utils/fileIO');
const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const currentPath = __dirname; 

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});

//simple asynchronous helper function
let check = function(done, f) {
  try {
    f();
    done();
  } catch (e) {
    done(e);
  }
}
/*
exports.deleteDirectory = deleteDirectory;
exports.createNewFile = createNewFile;
exports.createNewDirectory = createNewDirectory;
exports.checkIfDirectory = checkIfDirectory;
exports.checkIfFile = checkIfFile;
exports.getDirectoryContents = getDirectoryContents;
*/
const expectBool = function(actual, expected) {
  expect(actual).to.equal(expected);
};


let fileExistenceTest = function(done) {
  let checkFileCallback = function(err, isFile) {
      check(done,() => {expectBool(isFile, true)});              
    };
  let checkFile = function () {
    fileIO.checkIfFile(path.join(currentPath, 'fileIO-test.js'), checkFileCallback);
  };
  setTimeout(checkFile, 0);
};

let fileNotDirectoryTest = function(done) {
  setTimeout(function() {
    check(done, function() {
      fileIO.checkIfFile(currentPath, function(err, isFile) {
        expect(isFile).to.equal(false);
      });
    });
  }, 0);
};

let imaginaryFileExistenceTest = function(done) {
  setTimeout(function() {
    fileIO.checkIfFile(path.join(currentPath, 'your_imagination.js'), function(err, isFile) {
      check(done, function() {
        expect(isFile).to.equal(false);
      });
    });
  }, 0);        
};

let directoryExistenceTest = function(done) {
  setTimeout(function() {
    check(done, function() {
      fileIO.checkIfDirectory(currentPath, function(err, isDirectory) {
        expect(isDirectory).to.equal(true);
      });
    });
  }, 0);      
};
  
let fileIsNotDirectoryTest = function(done) {
  setTimeout(function() {
      fileIO.checkIfDirectory(path.join(currentPath, 'test.js'), function(err, isDirectory) {
        check(done, function() {
          expect(isDirectory).to.equal(false);
      });
    });
  }, 0);    
};

let simpleGetContentsTest = function(done) {
  setTimeout(function() {
      fileIO.getDirectoryContents(currentPath, function(items) {
        check(done, function() {
          expect(items).to.deep.equal(['fileIO-test.js', 'testblank.js', 'testblank2.js']);
      });
    });
  }, 0);
};

let deleteDirectoryTest = function(done) {
  
  let directoryExistsCase = function() {
    let deleteDirectoryCheck = function() {
      fileIO.checkIfDirectory(path.join(currentPath, 'testDirectory'), function(innerError, isDirectoryInner) {
        check(done, function() {
          expect(isDirectoryInner).to.equal(false);
        });
      });
    };
    fileIO.deleteDirectory(path.join(currentPath, 'testDirectory'), deleteDirectoryCheck );
  };
  
  let directoryDNECase = function() {
   let createThenDelete = function(err, isDirectoryPre) {
      let deleteDirectoryCheck = function() {
        fileIO.checkIfDirectory(path.join(currentPath, 'testDirectory'), function(innerError, isDirectoryPost) {
          check(done, function() {
            expect(isDirectoryPre).to.equal(true);
            expect(isDirectoryPost).to.equal(false);
          });
        });
      }
      fileIO.deleteDirectory(path.join(currentPath, 'testDirectory'), deleteDirectoryCheck);
    };
    fs.mkdir(path.join(currentPath, 'testDirectory'), function() {
      fileIO.checkIfDirectory(path.join(currentPath, 'testDirectory'), createThenDelete);          
    });
  }
  
  setTimeout(function() {
    fileIO.checkIfDirectory(path.join(currentPath, 'testDirectory'), function(err, isDirectory) {
      if(isDirectory) {
        directoryExistsCase();
      }
      else {
        directoryDNECase();
      }
    });
  }, 100);
};

describe('fileIO', function() {
  // test checkIfFile
  describe('#checkIfFile', function() {
    it('should see that this codefile exists', fileExistenceTest);
    it('should see that this directory is not a file', fileNotDirectoryTest);
    it('should see that an imaginary codefile does not exist', imaginaryFileExistenceTest);
  });
  describe('#checkIfDirectory', function() {
    it('should see that this directory exists', directoryExistenceTest);
    it('should see that this file is not a directory', fileIsNotDirectoryTest);
  });
  describe('#getDirectoryContents', function() {
    it('should return an array containing the files in this directory', simpleGetContentsTest);
  });
  describe('#deleteDirectory', function() {
    it('should delete a directory.', deleteDirectoryTest);
  });
});



