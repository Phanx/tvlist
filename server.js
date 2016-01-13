var express = require('express');
var app = express();

app.use(express.static(__dirname + '/app'));

app.set('port', process.env.PORT || 10101);

var server = app.listen(app.get('port'), function() {
	console.log("Serving on port " + app.get('port'));
});

