'use strict';

var avatar = require('../lib/avatar-generator.js')();

avatar('@user', 'male', 400).toBuffer(function (err, buffer) {
  console.log(buffer.toString('base64'));
});
