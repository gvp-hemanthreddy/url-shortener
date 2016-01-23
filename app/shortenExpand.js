var sqlModel = require('./model.js'),
	config = require('../config/config.json'),
	possibleCharacters = config.possibleCharacters,
	BASE = possibleCharacters.length;

var isValidURL = function(url) {
	var regexp = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	return regexp.test(url);
};

var encode = function(rowId) {
	var list = [];

	while (rowId > 0) {
		list.push(possibleCharacters[rowId % BASE]);
		rowId = Math.floor(rowId / BASE);
	}

	return list.join('');
};

var decode = function(shortURL) {
	var rowId = 0,
		i = 0,
		l = shortURL.length,
		mult = 1;

	for (; i < l; ++i) {
		rowId += (possibleCharacters.indexOf(shortURL[i]) * mult);
		mult *= BASE;
	}

	return rowId;
};

var shorten = function(longURL, callback) {
	if (isValidURL(longURL)) {
		sqlModel.insertRow(longURL, function(rowId) {
			callback(null, encode(rowId));
		});
	} else {
		callback(300);
	}
};

var expand = function(shortURL, callback) {
	sqlModel.selectRow(decode(shortURL), function(data) {
		callback(null, data);
	});
};

module.exports = {
	shorten: shorten,
	expand: expand
};