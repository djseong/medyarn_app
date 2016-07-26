var Client = require('mariasql');

var c = new Client({
  host: '127.0.0.1',
  user: 'username',
  password: 'password'
});

c.query('CREATE DATABASE IF NOT EXISTS database_development', function(err, rows) {
  if (err)
    throw err;
  console.log('Database created: ',rows);
});

c.end();