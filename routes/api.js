//Dependencies
var express = require('express');
var router = express.Router();
var phantomService = require('../service/phantomJs');

//Routes
router.get('/screenshot/:url', function(req, res) {
    phantomService.screenshot(req, res);
});

module.exports = router;
