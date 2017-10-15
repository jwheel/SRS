const express = require('express');
const app = express();
const path = require('path');


app.get('/', function (req, res) {
  //res.send('Hello World!')
  res.sendFile(path.join(__dirname +  "/public/index.html"));
});

app.post('/', function(req, res) {
    console.log(req.body);

});

app.use("/css", express.static(path.join(__dirname, 'public', 'css')));



app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});