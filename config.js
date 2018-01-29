const mysql = require('mysql');

const con = mysql.createConnection({
	host : "localhost",
	user : "root",
	password : "frog@gone",
	database : "event_manager"
});

module.exports = con;