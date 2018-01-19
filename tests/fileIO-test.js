const assert = require('assert');
const fileIO = require('./../utils/fileIOrxjs');
const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const config = require('./../config.js');
const test_directory = config.app_settings.test_directory
const Rx = require('rxjs');
const path = require('path');



describe('fileIO_checkIfDirectory', () => {
  
  it('should return true for a directory', done => {
    const dir = test_directory;
    fileIO.isDirectory(dir).subscribe(val => {
      assert.equal(val, true);
      done();
    }, error => {
      done(error);
    });
  });
  it('should return false for a non-existant directory', done => {
    const dir = test_directory;
    fileIO.isDirectory(path.join(dir,'blah')).subscribe(returnValue =>{
      assert.equal(returnValue, false);
      done();
    });
  })
});

const assertIsDirectory = function(isDirectory) {
  assert.equal(isDirectory, true);
}

const assertIsNotDirectory = function(isDirectory) {
  assert.equal(isDirectory, false);  
}

const directoryDoesNotExistTest = function(directory,isFinal) {
  fileIO.isDirectory(directory).subscribe(result => assertIsNotDirectory(result, true));
}


describe('fileIO_DeleteFIle_GetDirectoryContents_CreateFile', () => {
  //the only way I know to test this is in tandem
  it('should list contents of a directory', done => {
      const dir = test_directory;
      fileIO.getDirectoryContents(dir)
        .subscribe(val => {
          assert.equal('decks',val[0]);
          assert.equal('fileIO-test.js',val[1]);
          done();        
          
          }, error => {
            done(error);
        });
  });
    
  it('should create a directory if it does not exist and delete a directory', done => {
    const testDir = path.join(test_directory,'test');

    //should ultimately return deleteDirectoryObservable
    const existsBranch = function(isDir,dir) {
      if(isDir) {
        return fileIO.deleteDirectory(dir);
      } else {
        return fileIO.createNewDirectory(dir)
                .flatMap(() => {
                  return fileIO.isDirectory(dir)
                })
                .flatMap(result => {
                  assert.equal(result,true);
                  return fileIO.deleteDirectory(dir);
                });
      }
    };
    fileIO.isDirectory(testDir)
      .flatMap(isDir => {
          
          return existsBranch(isDir, testDir)
      })
      .flatMap(result => {
        return fileIO.isDirectory(testDir);
      })
      .subscribe(finalResult => {
        assert.equal(finalResult,false);
        done();
      })
  });
});