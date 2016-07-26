var mysql  = require('mysql');

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'username',
  password : 'password'
});

connection.connect();

connection.query('CREATE DATABASE IF NOT EXISTS database_development', function(err, rows, fields) {
  if (err) throw err;

  console.log('Database created: ', rows);
});

connection.end();
