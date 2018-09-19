#! /usr/bin/env node
const AvatarGenerator = require('./lib')
const program = require('commander')

const generator = new AvatarGenerator()
const variants = generator.variants

function checkDiscriminator(value) {
  return variants.indexOf(value) !== -1
}

program
  .version(require('./package').version)
  .option('-I, --id <id>', 'id for avatar. any string')
  .option(
    '-D, --discriminator [value]',
    'avatar discriminator (one of: ' + variants.join(', ') + ')',
    variants[0],
    checkDiscriminator
  )
  .option('-S, --size <width>', 'avatar size', parseInt, 400)
  .option('*')
  .parse(process.argv)

try {
  let out = process.stdout
  if (program['*'] && Array.isArray(program['*']) && program['*'].length > 0) {
    out = require('fs').createWriteStream(program['*'][0])
  }
  generator
    .generate(program.id || '', program.discriminator)
    .then((image) =>
      image
        .resize(program.size, program.size)
        .png()
        .pipe(out)
    )
    .catch((err) => {
      console.error(err)
      program.help()
    })
} catch (err) {
  console.error(err)
  program.help()
}
