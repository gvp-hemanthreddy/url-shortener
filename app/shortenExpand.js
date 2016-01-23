var sqlModel = require('./model.js'),
	config = require('../config/config.json'),
	possibleCharacters = config.possibleCharacters,
	BASE = possibleCharacters.length;

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
	sqlModel.insertRow(longURL, function(rowId) {
		callback(encode(rowId));
	});
};

var expand = function(shortURL, callback) {
	sqlModel.selectRow(decode(shortURL), function(data) {
		callback(data);
	});
};

module.exports = {
	shorten: shorten,
	expand: expand
};