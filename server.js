require('require-self-ref');
require('marko/node-require');
require('lasso/node-require-no-op').enable('.less', '.css');
require('marko/express');
const Rx = require('rxjs');
const AppModel = require('./models/app');
const DeckModel = require('./models/deck');
const CardModel = require('./models/card');
const bodyParser = require('body-parser');
var express = require('express');
var markoExpress = require('marko/express');
const config = require('./config.js');
const deck_directory = config.app_settings.deck_directory
var template = require('./src');


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
    
    
    console.log(req.body);
    let deckName = req.body.deckName;
    console.log(deck_directory);
    let deck = new DeckModel.Deck(deckName, deck_directory);

    deck.load()
    .flatMap(x => {
        let card = {
            question:req.body.question,
            answer:req.body.answer
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

app.get('/', require('./src'));


app.listen(port, function() {
    console.log('Listening on port %d', port);

    // The browser-refresh module uses this event to know that the
    // process is ready to serve traffic after the restart
    if (process.send) {
        process.send('online');
    }
});

