//Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var ECT = require('ect');
var ectRenderer = ECT({ watch: true, root: __dirname + '/views', ext : '.ect' });
var responseTime = require('response-time');


//Express
var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.engine('ect', ectRenderer.render);
app.set('view engine', 'ect');

//log request stats
app.use(responseTime(function(req, res, time) {
    console.log('=======STATS=======');
    console.log('User agent: ' + req.headers['user-agent']);
    console.log('Referrer: ' + req.headers['referer']);
    console.log('Time spent: ' + time + ' ms');
    console.log('===================');
}));

//Routes
app.use('/api', require('./routes/api'));
app.use('/share', require('./routes/share'));
app.use('/photobooth', require('./routes/photobooth'));

// Start server
app.listen(3000);
console.log('API is running on port 3000');
