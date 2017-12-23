const path = require('path');
const fileIO = require('./../utils/fileIO');
const chai = require('chai');
const expect = chai.expect;
const config = require('./../config'); 
const deck = require('./../models/deck');
const utils = require('./shared_utils');
const check = utils.check;

describe('deck', function() {
    describe('createNewDeck', function() {
        it('should, given a name, create a new Deck', function() {
            deck.createNewDeck('thingy');
             
            
          });
        });
    });
