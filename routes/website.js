//Dependencies
var express = require('express');
var router = express.Router();

//Routes
router.get('/', function(req, res) {
   res.render('index.ect');
});

router.post('/example', function(req, res){
  var url = req.body.url;
  res.redirect('/api/screenshot/' + encodeURIComponent(url));
});

module.exports = router;
