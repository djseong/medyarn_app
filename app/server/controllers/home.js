/** home page route **/
var c = require('nconf')
,	async = require('async')
, 	_ = require('underscore');

exports.index = function(req, res, next){
 	if (req.user) {
  		res.redirect('/home');
  	} else {
    	res.render('index',{
		 	title : 'Welcome to Prototype'
	   	})
	}
}

exports.home = function(req, res, next){
	async.parallel({
	    home_items: function(callback){
			callback(null);
	    }
	},    
 	function(err, items1) {
 		res.render('home', 
		{ 
			title : 'Home | Prototype', 
			user: req.user
		})
 	})
}

