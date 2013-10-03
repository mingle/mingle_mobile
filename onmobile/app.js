var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var search = require('./routes/search');
var move = require('./routes/move');

var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set( 'port', process.env.PORT || 3000 );
app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'ejs' );
app.use( express.favicon() );
app.use( express.logger('dev') );
app.use( express.bodyParser() );
app.use( express.methodOverride() );
app.use( express.cookieParser('your secret here') );
app.use( express.session() );
app.use( app.router );
app.use( require('stylus').middleware(__dirname + '/public') );
app.use( express.static(path.join(__dirname, 'public')) );

// development only
app.configure( 'development', function (){
  app.use( express.errorHandler({ dumpExceptions : true, showStack : true }));
});

app.configure( 'production', function (){
  app.use( express.errorHandler());
});

app.get( '/', routes.index );
app.post( '/search', search.results );
app.get( '/move/:card_number/:status', move.moveCard );
app.get( '/users', user.list );

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
