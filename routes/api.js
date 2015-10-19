//Dependencies
var express = require('express');
var router = express.Router();
var phantom = require ('phantom');
var fs = require('fs');
var urlUtil = require('url');

var ALLOWED_ORIGINS = ['onefootball.com'];

//Routes
router.get('/screenshot/:url', function(req, res){
    //first get url that is passed in as param
    var url = decodeURIComponent(req.params.url);
    //get url params - of current url
    var url_parts = urlUtil.parse(req.url, true);
    var query = url_parts.query;
    var viewportWidth = parseInt(query.w) || 800;
    var viewportHeight = parseInt(query.h) || 600;
    console.log('Requested url - ' + url);
    console.log('User agent: ' + req.headers['user-agent']);
    console.log('Referrer: ' + req.headers['referrer']);
    console.log('Viewport set width: ' + viewportWidth);
    console.log('Viewport set width: ' + viewportHeight);

    if(!isValidOrigin(url)) {
        res.status(403).send('Forbidden');
        return;
    }
    var startTime = new Date();
    phantom.create(function (ph) {
        ph.createPage(function (page) {
            page.get('settings.userAgent', function(data) {
                page.set('viewportSize', {width: viewportWidth, height: viewportHeight});
                page.set('settings.userAgent', data + ' Photobooth (+https://github.com/Onefootball/PhotoBoothApi.git)');
                page.open(url, function (status) {
                    console.log("opened url? ", status);
                    page.renderBase64('png', function (data) {
                        console.log("Image fetched...sending response...");
                        ph.exit();
                        var endTime = new Date();
                        var img = new Buffer(data, 'base64');
                        res.writeHead(200, {
                            'Content-Type': 'image/png',
                            'Content-Length': img.length
                        });
                        res.end(img);
                        var endTime = new Date();
                        var timeSpent = (endTime - startTime)/1000;
                        console.log("Time spent - " + timeSpent + " s");
                        var logLine = "Url: " + url + ", Time spent: " + timeSpent + "s;\n";
                        fs.appendFile('photobooth.txt', logLine, function (err) {
                          if (err) {
                              console.log(error);
                          };
                        });
                    });
                });
            });
        });
    });
});

function isValidOrigin(url) {
    try{
        var urlNoProtocol = url.split('//')[1];
        var domain = urlNoProtocol.split('/')[0];
        //domain should end with allowed origin
        for(var i = 0; i < ALLOWED_ORIGINS.length; i++){
            if(domain.indexOf(ALLOWED_ORIGINS[i], domain.length - ALLOWED_ORIGINS[i].length) !== -1) {
                return true;
            }
        }
        console.log('Origin not allowed' );
        return false;
    } catch (error) {
        console.log('Invalid url passed');
        console.log(error);
        return false;
    }
}

module.exports = router;
