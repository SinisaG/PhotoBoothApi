//Dependencies
var express = require('express');
var request = require('request');
var router = express.Router();

//Routes
router.get('/cms/:lang/:id', function (req, res) {
    var newsLangauge = req.params.lang;
    var newId = req.params.id;

    //get it somehow from config!!
    var url = 'https://cms-staging.onefootball.com/:lang/:id'
        .replace(':lang', newsLangauge)
        .replace(':id', newId);

    request(url, function (error, response) {
        if (!error && response.statusCode == 200) {
            //this part can be automatic
            var responseObject = JSON.parse(response.body);
            var news = responseObject.data.item;

            //data passed to view. We always use one level abstraction, so template inheritance can be handled nicely
            var data = {
                vm :{
                    metadata: {
                        title: news.title,
                        description: 'Read this news on Onefootball',
                        imgHeight: 630,
                        imgWidth: 1200,
                        siteName: "Onefootball",
                        type: "article",
                        imgUrl: buildMetadataImg(req)
                    }
                }
            };
            switch (news.content_type) {
                case 'native_article':
                   res.render('share/base', data);
                    break;
                case 'transfer_rumour':
                    break;
                case 'transfer_fact':
                    break;
                default:
                    //unexpected result
                    res.send(404);
            }
        } else {
            res.send(404);
        }
    });
});

function buildMetadataImg (req) {
    var origin = req.protocol + '://' + req.get('host');
    var templateUrl = origin + '/photobooth' + req.url;
    var apiUrl = origin + '/api/screenshot/';
    return apiUrl + encodeURIComponent(templateUrl);
}

module.exports = router;
