//Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var ECT = require('ect');
var ectRenderer = ECT({ watch: true, root: __dirname + '/views', ext : '.ect' });

//Express
var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.engine('ect', ectRenderer.render);
app.set('view engine', 'ect');

//Routes
app.use('/api', require('./routes/api'));
app.use('/share', require('./routes/share'));
app.use('/photobooth', require('./routes/photobooth'));

// Start server
app.listen(3000);
console.log('API is running on port 3000');
