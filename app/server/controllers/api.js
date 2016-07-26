/** home page route **/
var fs = require('fs')
,	dust = require('dustjs-linkedin')
,	async = require('async')
, passport = require('passport')
,	_ = require('lodash')
,	hs = require('../../plugins/hash')
,	signup = require('../../plugins/signup')
, em = require('../../plugins/email')
, crypto = require('crypto')
,	Person = app.get('models').Person
,	Profile = app.get('models').Profile
, Question = app.get('models').Question
, Pictures = app.get('models').Pictures
, Topic = app.get('models').Topic
, Answers = app.get('models').Answers;

exports.showanswerPost = function (req,res,next) {
	if (req.body.answer != "")
	{
		Answers.createOne ({
			person_id: req.session.passport.user, 
			question_id: req.body.question_id, 
			answer_id: req.body.answer_id,
			text: req.body.answer
		}, function (e,p) {
			if (e) 
			{
				//console.log (e)
			}
			else 
			{
				//console.log ("created answer")
				//console.log (p)
			}
		})}
	res.redirect ('back');
}

exports.showanswer = function (req,res,next) {

	Question.findAll ({
		where: {id: req.session.question_id},
		include: [Profile, Topic]
	}).then (function (q_p_t) {
	Answers.findAll({
		where: {question_id: req.session.question_id },
		order: [['answer_id'], ['id']]
	}).then (function (answers) {
		//console.log ('here')
		//console.log (JSON.stringify(p1));
		Profile.findOne({where: {pid: req.session.passport.user}
	}).then (function (uname) {
		//console.log("here is user")
		//console.log(uname)
		//console.log ("here is the answers")
		//onsole.log (answers)
		res.render ('showanswer', 
	{
		'question_id': req.session.question_id,
		'question': q_p_t,
		'answers': answers,
	})
	})
	}) })
	.catch(function(error) {
		console.log (error)
	})
		
}

exports.search_post = function(req, res, next) {
	if (req.body.search_topic) {
	Topic.findAll({
		where: {name: req.body.search_topic},
		include: [{model: Question, include: [Profile, Pictures]}]
	}).then(function (result) {
		console.log (JSON.stringify(result))
		res.render('search_result', 
		{
			'result': result
		})

	})
	.catch(function(error) {
		console.log(error)
	})
	}
	else {
		res.redirect('back')
	}
}

exports.answers_post = function (req,res,next) {
	//console.log(req.body.question_id); 

	req.session.question_id = req.body.question_id;

	//console.log (req.session.question_id);

	res.redirect ('showanswer')

}
exports.collaboration = function (req, res, next){
	Question.findAll({include: [Pictures, Topic, Profile], 
		order: [['created_at', 'DESC']]})
	.then(function(p){
			if (!p)
			{
				console.log ("some error")
			}
			else
			{
				//console.log("printing assoc...")
				//console.log(p[0].Pictures[0].file_path)
				//console.log(JSON.stringify(p))
				res.render('collaboration', 
				{'collaboration': p})
			}
		});/*
		/*Question.findAll({include: [{
			model: Pictures, where: { include: [{ model: Answers, attributes: ["id", "question_id", "answer_id"], include: [{ model: Answers}]
		}
			]}
		}] })*/ /*
		Question.findAll({include: [{
				all: true, nested: true, raw: true

			}]
			})*/
		/*.then(function(p) {
			console.log (JSON.stringify(p))
		})*/

	
}
exports.create_collaborationPost = function (req, res, next){ 
	Question.createOne ({
		title: req.body.collab_title,
		text: req.body.collab_question,
		created_person_id: req.session.passport.user,
		created_profile_id: req.session.passport.user,
		is_anonymous: 0, 
		upvoter_count: 0,
		downvoter_count: 0,
		is_answered: 0
	}, function (e,p) {
			if(e){
				console.log("first error");
			} else {
				if(!p){
					console.log("second error")
				} else {
						if (req.files.length != 0) 
						{
							for (var i = 0; i < req.files.length; i++)
								{
									Pictures.createOne ({
									file_path: req.files[i].path,
									question_id: p.id
									}, function (e1,p1) {
									if (e1) {
										console.log(e1)
									}
									else if (!p1) {
										console.log ("wrong picture")
									}
									else {
									callback(null, p1)
									}})
								}
						}
						if (req.body.collab_topic != "")
						{
							Topic.createOne ({
								name: req.body.collab_topic,
								question_id: p.id
							}, function (e2, p2) {
								if (e2) {
									console.log ("topic error")
								}
								else 
								{
									callback(null, p2)
								}
							})
						}
							}
							}			
			})
	res.redirect('collaboration')
	}

exports.create_collaboration = function(req, res, next){
	res.render('create_collaboration', 
  		{ title : 'Create Collaboration' })
}

exports.signupPost = function(req, res, next){	
	var action = req.body.action;
	if(action){
		if( action == "checkemail" ) {

			req.assert('eml', app.get("messages").signup.error.email).notEmpty().isEmail();

			var errors = req.validationErrors();
			if (errors) {
				return res.status(400).send(app.get("messages").signup.error.email);	
			} 
			
			var data = { email: req.body.eml.toLowerCase() };
			Person.findOne({ where: data })
			.then(function(p) {
				if(!p){
					return res.status(200).send(app.get("messages").signup.success.email_available);	
				} 
				res.status(400).send(app.get("messages").signup.error.taken_email);
				
			})
			.catch(function(error) {
				res.status(400).send(app.get("messages").signup.error.system);	
			});
			
		} else if( action == "register" ) {

			req.checkBody('name_first', app.get("messages").signup.error.first_name).notEmpty().isAlpha();
		  	req.checkBody('name_last', app.get("messages").signup.error.last_name).notEmpty().isAlpha();
		  	req.checkBody('email', app.get("messages").signup.error.email).notEmpty().isEmail();
		  	req.checkBody('password', app.get("messages").signup.error.password_characters).notEmpty().isAscii().isLength(6, 64);
		  	req.checkBody('passwordv', app.get("messages").signup.error.password_match).equals(req.body.password);

			var mappedErrors = req.validationErrors(true);
			if (mappedErrors) {
				req.flash('errors', mappedErrors);
				return res.redirect('/signup');
			} 

			// first checks if account with email exists, then hashes password and enters into db
			signup.createPerson({
				name_first: req.body.name_first,
			    name_last: req.body.name_last,
			    email: req.body.email.toLowerCase(),
			    password: req.body.password
			}, 
			function(e,p){
				if(e){
					req.flash('error', e);
					return res.redirect('/signup');
				} 
				if(!p){
					return res.redirect('/signup');
				} 
				
				req.flash('success', app.get("messages").signup.success.done);
				return res.redirect('/success');	
			})

		} else {
			req.flash('error', app.get("messages").error.system);
			return res.redirect('/signup');
		}
	}
}

exports.signup = function(req, res, next){
	res.render('signup', 
  		{ title : 'Sign Up' })
}

exports.signinPost = function(req, res, next) { 

	req.checkBody('username', app.get("messages").signup.error.email).isEmail();
	req.checkBody('password', app.get("messages").signin.error.password).notEmpty();

	var mappedErrors = req.validationErrors(true);
	if (mappedErrors) {
		req.flash('errors', mappedErrors);
		return res.redirect('/signin?username='+req.body.username);
	} 

	passport.authenticate('local', function(err, user, info) {
		if (err) { 
			return next(err) 
		}
		if (!user) {
			if(typeof user.attempt !== 'undefined' && user.attempt){
				Person.incrementFailedLogin({email: info.username},function(err,p){ 
				    if(err){
				      //log system error
				    }
				    req.flash('error',info.message);
					return res.redirect('/signin?username='+info.username);
				})
			} else {
				req.flash('error',info.message);
				return res.redirect('/signin?username='+info.username);
			}
		} else {
			req.login(user, function(err) {
			  if (err) { return next(err); }

			  Person.incrementLogin(user.id, {
			  	last_sign_in_at: Date.now(),
			  	current_sign_in_at: Date.now(),
					current_sign_in_ip: req.ip 
			  }, function(err,ui){
			    if(err){
			      //log system error
			    }
			    return res.redirect('/home');
			  })
			});
		}
	})(req, res, next);
}

exports.signin = function(req, res, next){
	if (req.user) {
	  	return res.redirect('/home');
	} 
	var signin_attempt = req.query['username'] || "";
	res.render('signin', 
  	{ title: 'Sign In', username_attempt: signin_attempt })
}

exports.signout = function(req, res) {
  req.logout();
  delete req.session.returnTo;
 
  res.redirect('/');
}

exports.retrievePost = function(req, res, next){
	var reset_token = req.body.challenge;

	req.checkBody('password', app.get("messages").signup.error.password_characters).notEmpty().isAscii().isLength(6, 64);
	req.checkBody('password_repeat', app.get("messages").signup.error.password_match).equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect('back');
	}

  	async.waterfall([
    	function(callback) {
    		Person.findOne({where: {reset_password_token: reset_token, reset_password_expires_at: {$gt: new Date() } }})
				.then(function(p) {
					
					if (!p) {
				        req.flash('error', app.get("messages").forgot.error.invalid_token);
				        return res.redirect('back');
				    }

					hs.saltAndHash(req.body.password, function(err,hash,salt){
						if(err){
							req.flash('error', app.get("messages").error.system);
							return res.redirect('back');
						}

						Person.updateOne(p.id,{ 
								password: hash, 
								salt: salt, 
								password_changed_at: Date.now(),
								reset_password_token: null,
								reset_password_expires_at: null
							}, function(e,p){
							if(!p){
								callback(app.get("messages").error.system);
							} 
							if(e){
								callback(app.get("messages").error.system);
							}
							callback(null);
						})
					})
				})
    	}
  	], function(err) {
	    if (err) {
	    	req.flash('error', app.get("messages").error.system);
			return res.redirect('back');
		};
		req.flash('success', app.get("messages").forgot.success.password_updated);
		return res.redirect('/signin');
	});
}

exports.retrieve = function(req, res, next){
	var reset_token = req.query.challenge;
	Person.findOne({where: {reset_password_token: reset_token, reset_password_expires_at: {$gt: new Date() } }})
		.then(function(p) {
			if (!p) {
        req.flash('error', app.get("messages").forgot.error.invalid_token);
        return res.redirect('/forgot');
      }
      res.render('retrieve',{ title : 'Retrieve Password', key: reset_token });
		})
		.catch(function(e) {
			req.flash('error', app.get("messages").error.system);
			res.redirect('/forgot');
		})
}

exports.forgotPost = function(req, res, next){
  
  req.checkBody('email', app.get("messages").signup.error.email).isEmail();

  var error = req.validationErrors();
	if (error) {
		req.flash('error', app.get("messages").signup.error.email);
		return res.redirect('/forgot');
	} 

  async.waterfall([
    function(callback) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        callback(err, token);
      });
    },
    function(token, callback) {
      Person.findOne({where:{ email: req.body.email.toLowerCase() }}).then(function(p) {
        if (!p) {
          req.flash('error', app.get("messages").forgot.error.email);
          return res.redirect('/forgot');
        }
      	p.update({
				  reset_password_token: token,
				  reset_password_expires_at: Date.now() + 3600000
				})
				.then(function() {
				  callback(null, token, p);
				}).catch(function(err) {
				  callback(err);
				})

      });
    },
    function(token, p, callback) {
    	var link = '<a href="'+app.get('uhttp')+'retrieve?challenge='+token+'">'+app.get('uhttp')+'retrieve?challenge='+token+'</a>';
			
      var subject = app.get("messages").forgot.email_subject;
			var body = "To retrieve your "+app.locals.site+" account password follow link below:<br/><br/>";
			body += link;
			body += "<br><br>"+app.locals.site+" Team";

			var email = { 
				subject: subject,
				to: p.email,
				body: body
			}
		em.sendemail(email, function(e,info){
			if(e){
				callback(e);
			} else {
				callback(null,p);
			}
		})
    }
  ], function(err,p) {
    if (err) {
    	req.flash('error', app.get("messages").forgot.error.email);
			return res.redirect('/forgot');
    }

    req.flash('success', app.get("messages").forgot.success.password_instructions_sent);
		res.redirect('/success?type=forgot');
  });

}

exports.forgot = function(req, res, next){
	res.render('forgot',
	{ title : 'Forgot Password' })
}

exports.activate = function(req, res, next){

	var activation_token = req.params.id;

	async.waterfall([
		function(callback){
			Person.activateToken(activation_token, function(e,p){
				if(e){
					console.log(e);
					callback(app.get("messages").error.system);
				} else {
					if(!p){
						callback(app.get("messages").activate.error.not_found);
					} else {
						callback(null,p);
					}
				}
			})
		},
	    function(p,callback){
	    	var ac = hs.validateActivationCode(p.confirmation_token,p.email);
				if(!ac){
					callback(app.get("messages").activate.error.code);
				} else {
					Person.updateOne(p.id, { 
						confirmed_at: Date.now(),
						confirmation_token: null,
						unconfirmed_email: null,
						status: 'a'
					}, function(e,p){				
						if(e){
							callback('Error with activation');
						} else {
							Profile.createOne(p.id, function(e,p){
								if(e){
									callback(app.get("messages").activate.error.general);
								} else {
									if(!p){
										callback(app.get("messages").activate.error.general);
									} else {
										callback(null,p);	
									}
								}
							})
						}
					})			
				}
		  	}
		],
	function(err, p) {
		if(err) { 
			req.flash('error', err);
			return res.redirect('/signup');
		}
		req.flash('success', app.get("messages").activate.success.done );
		res.redirect('/signin');
	});
}

exports.success = function(req, res, next){
	res.render('success',
	  { title : 'Success' }	)
}
