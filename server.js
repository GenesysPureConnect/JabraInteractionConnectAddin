var http = require("http");
var config = require('./development_config.json');
var express = require('express');
var cicProxy = require('./cicproxy.js');

var app = express();

app.use('/addins', express.static('src'));
//app.use('/config', express.static('config'));
app.get('/config/addins.json', function (req, res) {
    res.sendFile(__dirname + '/config/addins.json')
});

app.use(cicProxy());


app.set('port', (process.env.PORT || config.port));

console.log("starting web server on port " + app.get('port'));

var httpServer = http.createServer(app);
httpServer.listen(app.get('port'));
