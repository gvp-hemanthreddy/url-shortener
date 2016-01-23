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
	shortenExpand.shorten(req.body.longURL, function(err, shortURL) {
		if (err) {
			sendResponse(res, err);
		} else if (shortURL) {
			var hostURL = config.hostname + ':' + config.port + '/';
			sendResponse(res, 200, {
				"shortURL": hostURL + shortURL
			});
		} else {
			sendResponse(res, 500);
		}
	});
});

app.get('/api/v1/expand', function(req, res) {
	shortenExpand.expand(req.body.shortURL, function(err, data) {
		if (data.length === 1) {
			res.redirect(301, data[0].long_url);
		} else {
			res.status(404).send('Sorry, we cannot find that!');
		}
	});
});

app.get(/^\/([\w=]+)$/, function(req, res) {
	shortenExpand.expand(req.params[0], function(err, data) {
		if (data && data.length === 1) {
			res.redirect(301, data[0].long_url);
		} else {
			res.status(404).send('Sorry, we cannot find that!');
		}
	});
});

// catch 404.
app.use(function(req, res, next) {
	res.status(404).send('Sorry, we cannot find that!');
});

app.listen(config.port, function() {
	console.log('Node server is listening on port ' + config.port);
});

var sendResponse = function(res, statusCode, data) {
	var status_codes = {
		200: 'OK',
		300: 'Incorrect Link',
		400: 'Bad Request',
		404: 'Not Found',
		500: 'Internal Server Error',
		503: 'Unknown Server Error'
	};

	res.type('application/json');

	data = data || {};

	data.status_code = (status_codes[statusCode]) ? statusCode : 503;
	data.status_txt = status_codes[statusCode] || status_codes[503];

	res.send(data);
};