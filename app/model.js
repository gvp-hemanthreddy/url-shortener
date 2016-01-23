var mysql = require('mysql'),
	config = require('../config/config.json'),
	databaseName = config.db.name,
	CREATE_DATABASE = 'CREATE DATABASE IF NOT EXISTS ' + databaseName,
	SELECT_DATABASE = 'USE ' + databaseName,
	CREATE_URLS_TABLE = [
		'CREATE TABLE IF NOT EXISTS urls (',
		'`id` int NOT NULL AUTO_INCREMENT,',
		'`long_url` VARCHAR(300) NOT NULL,',
		'PRIMARY KEY (`id`)',
		') ENGINE=InnoDB DEFAULT CHARSET=utf8'
	],
	INSERT_ROW = 'INSERT INTO urls (`long_url`) VALUES (?);',
	SELECT_ROW = 'SELECT long_url FROM urls WHERE ID = ?',
	connection;

connection = mysql.createConnection({
	host: config.hostname,
	user: config.db.user,
	password: config.db.password
});

connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}

	console.log('connected as id ' + connection.threadId);

	connection.query(CREATE_DATABASE, queryCallback);
	connection.query(SELECT_DATABASE, queryCallback);
	connection.query(CREATE_URLS_TABLE.join('\n'), queryCallback);
});

function queryCallback(err) {
	if (err) {
		console.error('error: ' + err.stack);
	}
};

var insertRow = function(longURL, callback) {
	connection.query(INSERT_ROW, [longURL], function(err, row) {
		var rowId = null;
		if (err) {
			console.error('error: ' + err.stack);
		}
		rowId = row.insertId;
		callback(rowId);
	});
};

var selectRow = function(rowId, callback) {
	connection.query(SELECT_ROW, [rowId], function(err, data) {
		if (err) {
			console.error('error: ' + err.stack);
		}
		callback(data);
	});
};

module.exports = {
	insertRow: insertRow,
	selectRow: selectRow
};