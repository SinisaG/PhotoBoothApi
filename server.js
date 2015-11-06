//Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var responseTime = require('response-time');
var ECT = require('ect');
var ectRenderer = ECT({ watch: true, root: __dirname + '/views', ext : '.ect' });
var path = require('path');
var lessMiddleware = require('less-middleware');

//Express
var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//log request stats
app.use(responseTime(function(req, res, time) {
    console.log('=======STATS=======');
    console.log('User agent: ' + req.headers['user-agent']);
    console.log('Referrer: ' + req.headers['referer']);
    console.log('Time spent: ' + time + ' ms');
    console.log('===================');
}));
//template engine
app.engine('ect', ectRenderer.render);
app.set('view engine', 'ect');
//less
app.use(lessMiddleware('/less', {
    dest: '/css',
    pathRoot: path.join(__dirname, 'public')
}));
//assets
app.use(express.static(path.join(__dirname + '/public')));
//Routes
app.use('/', require('./routes/website'));
app.use('/api', require('./routes/api'));
// Start server
app.listen(3000);
console.log('API is running on port 3000');
