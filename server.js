require('require-self-ref');
require('marko/node-require');
require('lasso/node-require-no-op').enable('.less', '.css');
require('marko/express');
const Rx = require('rxjs');
const AppModel = require('./models/app');
const DeckModel = require('./models/deck');
const CardModel = require('./models/card');
const StatModel = require('./models/statistics');
const bodyParser = require('body-parser');
var express = require('express');
var markoExpress = require('marko/express');
const config = require('./config.js');
const deck_directory = config.app_settings.deck_directory
var template = require('./src');
const _ = require('lodash');
const wordalizer = require('./utils/wordalizer');
const path = require('path');
require('lasso').configure({
    plugins: [
        'lasso-marko'
    ],
    outputDir:__dirname + '/static'
    
});

var app = express();
var port = process.env.PORT || 8070;

app.use(require('lasso/middleware').serveStatic());
app.use(bodyParser.json());

app.get('/api/decks',function(req, res) {    
    let appInternal = new AppModel.App();
    let files = [];
    appInternal.getDecks(deck_directory)
    .subscribe(file => {
        files.push(file);
    }, error => {
        console.log(error);
    }, () => {
        res.json({'decks': files});
    });    
});

app.get('/api/decks/:name', function(req, res) {
    let name = req.params.name;
    
    let deck = new DeckModel.Deck(name, deck_directory);
    
    deck.load()
    .subscribe(deck => {

    }, error => {
        console.log(error);
    }, () => {
        res.json(JSON.stringify(deck));
    });
});

app.post('/api/decks/:name', function(req, res) {
    let name = req.params.name;

    let deck = new DeckModel.Deck(name, deck_directory);

    deck.save()
    .subscribe(result => {

    }, error =>{
        console.log(error);
    }, () => {
        res.json(JSON.stringify(deck));
    });
});

app.post('/api/decks/:name1/:name2', function(req,res) {
    let name1 = req.params.name1;
    let name2 = req.params.name2;

    let deck = new DeckModel.Deck(name1, deck_directory);

    deck.renameDeck(name1, name2,deck_directory)
    .subscribe(deck => {

    }, error => {
        console.log(error);
    }, () => {
        res.json(JSON.stringify(deck));
    });
});

app.post('/api/cards',function(req,res) {
    
    let deckName = req.body.deckName;
    let deck = new DeckModel.Deck(deckName, deck_directory);

    deck.load()
    .flatMap(x => {
        let card = {
            question:req.body.card.question,
            answer:req.body.card.answer
        };
        return Rx.Observable.of(card);    
    })
    .flatMap(card => {
        let candidateCard = new CardModel.Card();
        candidateCard.question = card.question;
        candidateCard.answer = card.answer;
        deck.addCard(candidateCard);
        return deck.save();
    }).subscribe(saveResult => {
        
        res.json({ok:true});
    }, error => {
            console.log(error);
    });
});

app.put('/api/cards/:id/:pass', function(req, res) {
    let deckName = req.body.deckName;
    let deck = new DeckModel.Deck(deckName, deck_directory);
    let id = req.params.id;
    let pass = req.params.pass == 1 ? true : false;
    deck.load()
    .flatMap(x => {
        
        let card = _.find(x.cards,c => {
            return c.id == id;
        });
        return Rx.Observable.of(card);    
    })
    .flatMap(c => {
        if(pass) {
            return c.pass();
        } else {
            return c.fail();
        }        
    })
    .flatMap(returnCard => {
        return deck.save();
    })
    .subscribe(result => {
        res.json({ok:true});
    }, error => {
            console.log(error);
    });
});
app.get('/api/statistics/histogram/:deckName', function(req,res) {
    let deckName = req.params.deckName;

    let stats = new StatModel.Statistics();

    stats.getDueDateHistogram(deckName, deck_directory)
    .subscribe(result => {
        res.json(result);
    }, error => {
        console.log(error);
    });
});

app.get('/word_list', function(req, res) {
    
    let inputFile = path.join(deck_directory, 'nihongo.txt');
    wordalizer.uniqueify(inputFile)
    .subscribe(result => {
        console.log(result.length);
        res.json(result);
    });
});

app.get('/review_list', function(req, res) {

    wordalizer.buildDictionary(deck_directory)
    .subscribe(result => {
       res.json(result); 
    });
});
app.get('/', require('./src'));

app.listen(port, function() {
    console.log('Listening on port %d', port);

    // The browser-refresh module uses this event to know that the
    // process is ready to serve traffic after the restart
    if (process.send) {
        process.send('online');
    }
});

