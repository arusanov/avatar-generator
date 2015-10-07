#! /usr/bin/env node

'use strict';

var generator = require('./lib/avatar-generator')();
var program = require('commander');

function checkDiscriminator(value) {
    return generator.discriminators.indexOf(value)!==-1;
}

program
    .version(require('./package').version)
    .option('-I, --id <id>', 'id for avatar. any string')
    .option('-D, --discriminator [value]', 'avatar discriminator (one of: ' + generator.discriminators.join(', ') + ')', 'male',checkDiscriminator)
    .option('-S, --size <width>', 'avatar size', parseInt, 400)
    .option('*')
    .parse(process.argv);

try {
    var out = process.stdout;
    if (program['*'] && Array.isArray(program['*']) && program['*'].length>0){
        out = require('fs').createWriteStream(program['*'][0]);
    }
    generator(program.id, program.discriminator, program.size).stream().pipe(out);

}
catch (err) {
    console.error(err);
    program.help();
}


