var pg = require('pg');
var conString = "postgres://username:password@localhost";

//this initializes a connection pool
//it will keep idle connections open for a (configurable) 30 seconds
//and set a limit of 20 (also configurable)
pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('CREATE DATABASE IF NOT EXISTS database_development', function(err, result) {
    done();

    if(err) {
      return console.error('error running query', err);
    }
    console.log('Database created: ',result.rows[0].number);

  });
});