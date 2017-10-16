const express = require('express');
const app = express();
const path = require('path');
var bodyParser = require('body-parser')

app.use(bodyParser.json());


app.get('/test', function(req, res) {
  console.log('request');
  console.log(req.query);
  console.log('response');
  
  let jsonResponse = {'testData': [1,2,3,4,5,6,7,8,9]};

  res.json(jsonResponse);
});

app.get('/', function (req, res) {
  //res.send('Hello World!')
  res.sendFile(path.join(__dirname +  "/public/index.html"));
});

app.post('/', function(req, res) {
    console.log(req.body);

});

app.use("/css", express.static(path.join(__dirname, 'public', 'css')));
app.use("/scripts", express.static(path.join(__dirname, 'public', 'scripts')));
app.use("/components/jQuery", express.static(path.join(__dirname, 'bower_components','jQuery','dist')));


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});