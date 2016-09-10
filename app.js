
var express = require('express')
,   http = require('http')
,   https = require('https')
// store session data like user login in memory 
,   session = require('express-session')
,   MongoStore = require('connect-mongo')(session)
// authentication middleware for username, password, etc
,   passport = require('passport')
// string validation for express (like isEmail)
,   expressValidator = require('express-validator')
// logs http requests in terminal 
,   morgan = require('morgan')  
// web application security middleware 
,   lusca = require('lusca')
// Lets you use HTTP verbs such as PUT or DELETE 
// in places where the client doesn't support it.
,   methodOverride = require('method-override')
,   cookieparser = require('cookie-parser')
// Facilitate use of favicons
,   favicon = require('serve-favicon')
,   bodyparser = require('body-parser')
// Use flash messages - messages that are stored 
// in session to display for user
,   flash = require('connect-flash')
// Access to file system - transfer of data to or 
// from storage (things like rename files)
,   fs = require('fs')
// Hierarchical node.js config with files
,   c = require('nconf')
// Lets you use all popular node.js template engines 
// like dust in express
,   cons = require('consolidate')
// Create express app 
,   app = express();

/* database */ 
var db = require ('./db')

/** make app global variable for less verbose controllers
    comes with node.js **/

GLOBAL.app = app;

// Sets 'trust proxy' name to true 
// Tells express that app is behind front facing proxy 
// (X-Forwarded-headers can be trusted)
app.enable('trust proxy');

/** check environment variable or set to development **/
var env = process.env.NODE_ENV || 'development';

/** set development specfic settings **/
if ('development' == env) {
  //app.use(morgan('dev'));
}

/**	set production specfic settings **/
if ('production' == env) {

}

/* Configure app according to info in this priority: 
  1. command line 
  2. envionrmental variables
  3. config.json file (with section given by var env in line 50)
*/
c.argv().env().file({ file: './config.json' });

// get a port from environmental variables
// the port is set in config.json
// not the same env as c.env()
var port = c.get(env).port;

var mongo = new MongoStore({ url: c.get(env).mongo.url }); 

// sets all the error messages declared in config.json
app.set('messages', c.get('messages'));

app.set('uhttps', c.get(env).https);
app.set('uhttp', c.get(env).http);
app.set('image_store', c.get(env).image_store);
app.set('file_store', c.get(env).file_store);
app.set('upload_dir', c.get(env).upload_dir);

// sets local variables - similar to using app.set()
// these variables persist through life of app
app.locals.site = c.get('site').title;
app.locals.site_description = c.get('site').description;
app.locals.site_url = app.get('uhttp');
app.locals.site_surl = app.get('uhttps');
app.locals.image_store = app.get('image_store');
app.locals.file_store = app.get('file_store');

/** set session variables **/
var session_options = {
  // default store is memorystore which saves to RAM - not recommended for production 
  store: mongo,
  secret: c.get('session').secret,
  cookie: { secure: false, maxAge: new Date(Date.now() + (3 * 3600000))},
  saveUninitialized: true,
  resave: false
};

/** load dust template engine **/
var template_engine = 'dust';
if ( template_engine == 'dust' ) {
  var dust = require('dustjs-linkedin');
  dust.debugLevel = "ERROR";
  // uses engine cons.dust for 'dust' extension files
  // can use to map engine to any extension name
  app.engine('dust', cons.dust);
}

// App Variables
app.set('port', port);

// Sets all view templates to views folder for render
app.set('views', __dirname + '/app/server/views');

// Using dust as template engine and default extension is .dust
app.set('view engine', template_engine);
/** Load Models **/
app.set('models', require('./app/server/models'));

// define middleware - first argument (default of '/') 
// is path to use it on, second is the function

// gets any request and serves any required files in 
// app public folder in root directory - must do for 
// static files like css
app.use(express.static(__dirname + '/app/public') );
app.locals.pretty = true;
app.use(favicon(__dirname + '/app/public/images/favicon.ico'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieparser());
app.use(session(session_options));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

/** Passport API authentication **/
var passportConfig = require('./app/plugins/authenticate');

// local variables
// these are available to views rendered in lifetime cycle 
// of that request
app.use(function(req, res, next){
  // sets array of flash messages with key 'error' to variable
  // locals.error for view to display accordingly 
  // these correspond to variable names in message.dust
  res.locals.error = req.flash('error');
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  next();
})

/** Controllers **/
var controllers = require('./app/server/controllers/')(app);


app.use(lusca({
  csrf: true,
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});

/* Connect to MySQL */ 
/*db.connect(db.MODE_PRODUCTION, function(err) {
  if (err) {
    console.log('Unable to connect to MySQL.')
    process.exit(1)
  } else {
    console.log('MySQL connected now...')
  }
})
*/
module.exports = app;

