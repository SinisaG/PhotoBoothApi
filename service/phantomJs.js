var phantom = require('phantom');
var urlUtil = require('url');

var ALLOWED_ORIGINS = [];

var phantomJS = {};

phantomJS.screenshot = function (req, res) {
    //first get url that is passed in as param
    var url = decodeURIComponent(req.params.url);
    //get url params - of current url
    var url_parts = urlUtil.parse(req.url, true);
    var query = url_parts.query;
    var viewportWidth = parseInt(query.w) || 800;
    var viewportHeight = parseInt(query.h) || 600;

    if (!isValidOrigin(url)) {
        res.status(403).send('Forbidden');
        return;
    }
    phantom.create(function (ph) {
        ph.createPage(function (page) {
            page.get('settings.userAgent', function (data) {
                page.set('viewportSize', {width: viewportWidth, height: viewportHeight});
                page.set('settings.userAgent', data + ' Photobooth (+https://github.com/Onefootball/PhotoBoothApi.git)');
                //prevent google analytics from loading
                page.onResourceRequested(function(requestData, request) {
                    if ((/google-analytics\.com/gi).test(requestData['url'])){
                        request.abort();
                    }
                });

                page.open(url, function () {
                    function checkReadyState() {
                        setTimeout(function () {
                            page.evaluate(function () {
                                return document.readyState;
                            }, function (result) {
                                if ("complete" === result) {
                                    page.renderBase64('png', function (data) {
                                        ph.exit();
                                        var img = new Buffer(data, 'base64');
                                        res.writeHead(200, {
                                            'Content-Type': 'image/png',
                                            'Content-Length': img.length
                                        });
                                        res.end(img);
                                    });
                                } else {
                                    checkReadyState();
                                }
                            });
                        });
                    }
                    checkReadyState();
                });
            });
        });
    });
};


function isValidOrigin(url) {
	if (ALLOWED_ORIGINS.length === 0) {
		return true;
	}
    try {
        var urlNoProtocol = url.split('//')[1];
        var domain = urlNoProtocol.split('/')[0];
        //domain should end with allowed origin
        for (var i = 0; i < ALLOWED_ORIGINS.length; i++) {
            if (domain.indexOf(ALLOWED_ORIGINS[i], domain.length - ALLOWED_ORIGINS[i].length) !== -1) {
                return true;
            }
        }
        return false;
    } catch (error) {
        return false;
    }
}

module.exports = phantomJS;