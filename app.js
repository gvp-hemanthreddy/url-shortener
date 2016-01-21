var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var shortenExpand = require('./app/shortenExpand');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/api/v1/shorten', function(req, res) {
	shortenExpand.shorten(req.body.longURL, function(shortURL) {
		res.send({
			"shortURL": shortURL
		});
	});
});

/*
app.get('/api/v1/expand', function(req, res) {
	shortenExpand.shorten(req.body.shortURL, function(longURL) {
		res.send({
			"longURL": longURL
		});
	});
});
*/

app.get(/^\/([\w=]+)$/, function(req, res) {
	shortenExpand.expand(req.params[0], function(data) {
		if (data.length === 1) {
			res.redirect(301, data[0].long_url);
		} else {
			res.send({
				'error': '404 error occured.'
			});
		}
	});
});

app.listen(3000, function() {
	console.log('Listening on port 3000');
});