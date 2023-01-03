import mysql from 'mysql2';

export const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'password',
	database: 'blog',
});
db.connect(function (err) {
	if (err) {
		return console.error('error: ' + err.message);
	}

	console.log('Connected to the MySQL server.');
});
