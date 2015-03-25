'use strict';

var avatar = require('../lib/avatar-generator.js')(),
    fs = require('fs');

var fstream = fs.createWriteStream('example.png');

avatar('@user', 'male', 400).stream().pipe(fstream);
