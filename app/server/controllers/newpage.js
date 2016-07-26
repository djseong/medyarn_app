var db = require('../../../db.js')

exports.personpost = function(req, res, next){

  // get form values 
  var email = req.body.email;
  var password = req.body.password;
  var values = [email, password]; 

  //write into database
  db.get().query('INSERT INTO people (email, password) VALUES (?, ?)', values, function(err, result){
    if(err) console.log("error inserting")
  })

  res.redirect ("personlist")
}

exports.personsign = function(req, res, next){
  res.render('personsign', 
      { title : 'New Person' })
}

exports.personlist = function(req, res, next){
  db.get().query('SELECT * FROM people', function (err, rows) {
    res.render('personlist', 
        {'personlist' : rows
      });
  })
}
