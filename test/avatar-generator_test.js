'use strict';

var avatar = require('../lib/avatar-generator.js'),
    os = require('os'),
    fs = require('fs'),
    path = require('path');


var testFiles = [];

exports.avatarGenerator = {
    setUp: function (done) {
        done();
    },
    tearDown: function (done){
        testFiles.forEach(function (file){
            try {
                fs.unlinkSync(file);
            } catch (err){

            }
        });
        done();
    },
    'generate file': function (test) {
        var fname = path.join(os.tmpdir(), new Date().getTime()+'.png');
        avatar.generate('@user', 'male', 400).write(fname, function (err) {
            test.ifError(err);
            test.ok(fs.existsSync(fname), 'file should exists');
            testFiles.push(fname);
            test.done();
        });
    },
    'make a stream': function (test) {
        var fname = path.join(os.tmpdir(), new Date().getTime()+'.png'),
            fstream = fs.createWriteStream(fname);
        var imageStream = avatar.generate('@user', 'male', 400).stream();
        imageStream.on('error',function (err){
           test.ifError(err);
           test.done();
        });
        imageStream.on('end',function (){
            test.ok(fs.existsSync(fname), 'file should exists');
            testFiles.push(fname);
            test.done();
        });
        imageStream.pipe(fstream);
    },
    'make a buffer': function (test) {
        avatar.generate('@user', 'male', 400).toBuffer(function (err,buffer){
            test.ifError(err);
            test.ok(buffer && buffer.length>0 , 'buffer is empty');
            test.done();
        });
    },
    'buffers with same key equals': function (test) {
        var buffer1;
        avatar.generate('@user', 'male', 400).toBuffer(function (err,buffer){
            test.ifError(err);
            buffer1 = buffer;
            avatar.generate('@user', 'male', 400).toBuffer(function (err,buffer){
                test.ifError(err);
                test.ok(require('buffer-equal')(buffer1,buffer), 'buffer not equals');
                test.done();
            });
        });
    },
    'buffers with different key not equals': function (test) {
        var buffer1;
        avatar.generate('@user1', 'male', 400).toBuffer(function (err,buffer){
            test.ifError(err);
            buffer1 = buffer;
            avatar.generate('@user2', 'male', 400).toBuffer(function (err,buffer){
                test.ifError(err);
                test.ok(!require('buffer-equal')(buffer1,buffer), 'buffer equals');
                test.done();
            });
        });
    }
};
