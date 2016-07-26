
var multer = require('multer')({ dest: 'tmp/' })
,	home = require('./home')
,	info = require('./info')
,	account = require('./account')
,	errors = require('./error')
,	authorize = require('../../plugins/authorize')
,	h = require('../../plugins/helper')
,	api = require('./api')
,	newpage = require('./newpage');

// routes

module.exports = function(app) {
	
	/* All routes */
	app.all('*', authorize.role);

	/* home page routes */
	app.get('/', home.index);
	app.get('/home', authorize.user, home.home);
	app.get('/people',authorize.asset);
	
	/* account routes */
	app.get('/account', authorize.user, account.index);
	
	app.post('/account/profile', multer.single('avatar'), account.profilePost);
	app.get('/account/profile', account.profile);

	app.post('/account/password', account.passwordPost);
	app.get('/account/password', authorize.user, account.password);

	/* authentication routes */
	app.post('/signup', api.signupPost);
	app.get('/signup', api.signup);

	app.post('/signin', api.signinPost);
	app.get('/signin', api.signin);

	app.get('/signout',  authorize.user, api.signout);

	app.post('/forgot', api.forgotPost);
	app.get('/forgot', api.forgot);

	app.post('/retrieve', api.retrievePost);
	app.get('/retrieve', api.retrieve);

	app.get('/activation/:id', api.activate);

	/* Collab page 
			multer.array accepts multiple pics of fieldname collab_pics 
			as specified by collab_form.dust and maxcount of 4*/ 
	app.post('/create_collaboration', multer.array('collab_pics', 4), api.create_collaborationPost)
	app.get('/create_collaboration', authorize.user, api.create_collaboration)

	app.post('/collaboration', api.answers_post)
	app.get('/collaboration', authorize.user, api.collaboration)

	app.post('/collaboration/search', api.search_post)

	app.post ('/showanswer', api.showanswerPost)
	app.get ('/showanswer', authorize.user, api.showanswer)

	/* New page routes */
	app.post('/newpage', newpage.personpost);
	app.get('/newpage', newpage.personsign);

	app.get('/personlist', newpage.personlist); 

	/* About page routes */
	app.get('/about', info.about);
	app.get('/help', info.help);
	app.get('/terms', info.terms);
	app.get('/privacy', info.privacy);
	app.get('/contact', info.contact);

	app.get('/success', api.success);

	/* Handle 404 */
	app.use(errors.error404);
	app.use(errors.error500);
}
