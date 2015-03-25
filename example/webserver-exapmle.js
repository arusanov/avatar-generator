'use strict';

var avatar = require('../lib/avatar-generator.js')(),
    connect = require('connect'),
    fs = require('fs'),
    path = require('path'),
    url = require('url'),
    http = require('http'),
    crypto = require('crypto');

var tempPath = path.join(__dirname,'tmp');

var app = connect()
    .use(function (req, res) {
        try {
            //parse url and generate avatar on the fly
            var query = url.parse(req.url, true).query;
            if (query && query.id && avatar.discriminators.indexOf(query.s) !== -1) {
                var size = parseInt(query.size) || 400;
                var etag = crypto.createHash('md5').update(query.id + query.s + size).digest('hex');
                if (req.headers['if-none-match'] === etag) {
                    res.writeHead(304);
                    res.end();
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'image/png',
                        'ETag':etag
                    });
                    var fpath = path.join(tempPath,etag+'.png');
                    //Check for file exists in temp
                    fs.exists(fpath, function (exists) {
                        if (exists){
                            //Stream to resp
                            fs.createReadStream(fpath).pipe(res);
                        } else {
                            //Generate new one
                            var image =avatar(query.id, query.s, size).stream();
                            image.pipe(fs.createWriteStream(fpath));
                            image.pipe(res);
                        }
                    });
                }
            } else {
                res.writeHead(400);
                res.end();
            }
        } catch (err) {
            res.writeHead(500);
            res.end();
        }
    });

http.createServer(app).listen(process.env.PORT || 3000);
