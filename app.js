var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var urlshort = require('./app/urlshortener');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/api/v1/shorten', function(req, res) {
	res.send(req.body);
});

app.listen(3000, function() {
	console.log('Listening on port 3000');
});