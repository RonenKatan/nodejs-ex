
//  OpenShift sample Node application
var express = require('express'),
    fs      = require('fs'),
    app     = express(),
    eps     = require('ejs'),
    morgan  = require('morgan');
 var mongoose = require('mongoose');

Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
  mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
  mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
    mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
    mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
    mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
    mongoPassword = process.env[mongoServiceName + '_PASSWORD']
  mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase;

  }
}
else {
  mongoURL = database.localUrl
}
var db = null,

    dbDetails = new Object();

var initDb = function(callback) {
  console.log('!!!!!!!!!!!!!!!!!!!!')
  console.log(process.env)
  console.log('!!!!!!!!!!!!!!!!!!!!')
  if (mongoURL == null) return;

  //var mongodb = require('mongodb');
  if (mongodb == null) return;
  mongoose.connect(mongoURL);
  console.log('Connected to MongoDB at: %s', mongoURL);
  // mongodb.connect(mongoURL, function(err, conn) {
  //   if (err) {
  //     callback(err);
  //     return;
  //   }

  //   db = conn;
  //   dbDetails.databaseName = db.databaseName;
  //   dbDetails.url = mongoURLLabel;
  //   dbDetails.type = 'MongoDB';

  //   console.log('Connected to MongoDB at: %s', mongoURL);
  // });
};

initDb(function (err) {
  console.log('Error connecting to Mongo. Message:\n' + err);
});

//mongoose.connect(mongoURL); 	// Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)

app.use(express.static('./public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request


// routes ======================================================================
require('./app/routes.js')(app);

Object.assign=require('object-assign')

// error handling
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});
app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app;
