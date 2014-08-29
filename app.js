
/**
 * Module dependencies.
 */

var mysql = require("mysql");

var connection = new mysql.createConnection({
    "hostname": "localhost",
    "user": "root",
    "password": "",
    "database": "WS"
});

connection.connect(function(error) {
    if (error) {
        return console.log("CONNECTION error: " + error);
    }
});


var express = require('express')
  , http = require('http')
  , path = require('path');

var querystring = require('querystring');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/users', user.list);

app.get('/isRequestSent', function (req, res) {
    var queryString = 'SELECT * FROM event where event_id = ? and user_id = ?';
	var event_id = req.query.event_id;
	var user_id = req.query.user_id;
    console.log(event_id);
    console.log(user_id);
    connection.query(queryString, [event_id, user_id], function(err, result) {
	    if (err) {
	    	 throw err;
	    }
	    console.log(result);
	    if(result.length > 0)
	    	res.json('{"isRequestMade":"true"}');
	    else
	    	res.json('{"isRequestMade":"false"}');
	});
});

app.post('/addEventMetadata', function (req, res) {
	var selectString = 'SELECT * FROM event where event_id = ? and user_id = ?';
	var queryString = 'INSERT INTO event SET ?';
	var jsonData = JSON.parse(req.body.data);
	var event_id = jsonData.id;
	var user_id = jsonData.creator.email;
	connection.query(selectString, [event_id, user_id], function(err, result) {
	    if (err) {
	    	 throw err;
	    }
	    console.log(result);
	    if(result.length == 0){
	    	var post  = {event_id: event_id, user_id: user_id};
	    	connection.query(queryString, post, function(err, rows, fields) {
	    	    if (err) throw err;
	    	    res.json({isRequestMade:true});
	    	});
	    }
	});
	res.json({isRequestMade:"true"});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});