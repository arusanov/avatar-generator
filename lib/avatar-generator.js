/*
 * avatar-generator
 * https://github.com/arusanov/avatar-generator
 *
 * Copyright (c) 2014 Alex R
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    seed = require('seed-random'),
    exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    PassThrough = require('stream').PassThrough || require('through');

function Generator(settings) {
    settings = _.defaults(settings || {},require('../settings'));

    //List all images available
    var variants = {};
    fs.readdirSync(settings.images).forEach(function (discriminator) {
        var current = variants[discriminator] = {};
        fs.readdirSync(path.join(settings.images, discriminator)).forEach(function (file) {
            var match = /(.*?)(\d+)\.png/.exec(file);
            if (match) {
                if (!current.hasOwnProperty(match[1])) {
                    current[match[1]] = 0;
                }
                current[match[1]]++;
            }
        });
    });


    var generate = function (key, discriminator, size) {
        if (!size) {
            size = 400;
        }
        if (!key) {
            throw new Error('Key is not specified');
        }
        if (!variants.hasOwnProperty(discriminator)) {
            throw new Error('Unknown discriminator: ' + discriminator);
        }

        var parts = [],
            partNumber = 0,
            rand = seed(key),
            current = variants[discriminator];

        settings.order.forEach(function (partName) {
            if (current.hasOwnProperty(partName)) {
                partNumber = ~~(rand() * current[partName]) + 1;
                parts.push(path.join(settings.images, discriminator, partName + partNumber + '.png'));
            }
        });
        var command = parts.concat([
            '-layers', 'merge',
            '-gravity', 'center',
            '-quality', '100',
            '-filter', 'Box',
            '-compress', 'ZIP',
            '-resize', size + 'x' + size
        ]);

        var spawnOpts = {
            encoding: 'binary', maxBuffer: 500 * 1024, killSignal: 'SIGKILL', output: null
        };

        function streamToBuffer(stream, callback) {
            var done = false,
                buffers = [];

            stream.addListener('data', function (data) {
                buffers.push(data);
            });

            stream.on('end', function () {
                if (done) {
                    return;
                }
                done = true;
                callback(null, Buffer.concat(buffers));
                buffers = null;
            });

            stream.on('error', function (err) {
                done = true;
                buffers = null;
                callback(err);
            });
        }

        function stream(callback) {
            var throughStream = null;
            command.push("png:-");
            var proc = spawn(settings.convert, command, spawnOpts);
            proc.stderr.on('data', function (data) {
                callback(new Error(data));
            });

            if ("function" !== typeof callback) {
                throughStream = new PassThrough();
                callback = function (err, stdout) {
                    if (err) {
                        throughStream.emit('error', err);
                    }
                    else {
                        stdout.pipe(throughStream);
                    }
                };
            }
            callback(null, proc.stdout);
            return throughStream;
        }

        return {
            write: function (file, callback) {
                command.push(file);
                exec(settings.convert + ' ' + command.join(' '), callback);
            },
            stream: stream,
            toBuffer: function (callback) {
                command.push("PNG:-");
                var proc = spawn(settings.convert, command, spawnOpts);
                proc.stderr.on('data', function (data) {
                    callback(new Error(data));
                });
                streamToBuffer(proc.stdout, callback);
            }
        };
    };
    generate.discriminators = Object.keys(variants);
    return generate;
}

module.exports = exports = Generator;
