'use strict';

var avatar = require('../lib/avatar-generator.js'),
    connect = require('connect'),
    url = require('url'),
    http = require('http');

var app = connect()
    .use(function (req, res) {
        try {
            //parse url and generate avatar on the fly
            var query = url.parse(req.url, true).query;
            if (query && query.id && avatar.discriminators.indexOf(query.s)!==-1) {
                var size = parseInt(query.size) || 400;
                res.writeHead(200, {
                    'Content-Type': 'image/png'
                });
                avatar.generate(query.id, query.s, size).stream().pipe(res);

            } else {
                res.writeHead(400);
                res.end();
            }
        } catch (err) {
            res.writeHead(4500);
            res.end();
        }
    });

http.createServer(app).listen(process.env.PORT || 3000);
