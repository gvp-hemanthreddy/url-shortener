var express = require('express'),
	bodyParser = require('body-parser'),
	path = require('path'),
	app = express(),
	shortenExpand = require('./app/shortenExpand'),
	config = require('./config/config.json');

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

app.listen(config.port, function() {
	console.log('Node server listening on port ' + config.port);
});