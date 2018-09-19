# avatar-generator [![Build Status](https://secure.travis-ci.org/arusanov/avatar-generator.png?branch=master)](http://travis-ci.org/arusanov/avatar-generator)

8bit avatar generator like one below. 

Inspired by https://github.com/matveyco/8biticon (icons also theirs).
Generate same icons for same ids like gravatar, 
Use email or md5 or any string for generating and get the same avatar.

## Getting Started

Install the module with: `npm install avatar-generator`

This library uses http://sharp.pixelplumbing.com/ for all image processing.

Version 2.0 is not compatible with 1.x

```js
const AvatarGenerator = require('avatar-generator')
const avatar = new AvatarGenerator({
    //All settings are optional.
    parts: ['background', 'face', 'clothes', 'head', 'hair', 'eye', 'mouth'], //order in which sprites should be combined
    partsLocation: path.join(__dirname, '../img'), // path to sprites
    imageExtension: '.png' // sprite file extension
})
const variant = 'female' // By default 'male' and 'female' supported
const image = await avatar.generate('email@example.com', variant)
// Now `image` contains sharp image pipeline http://sharp.pixelplumbing.com/en/stable/api-output/
// you can write it to file
image
    .png()
    .toFile('output.png')
// or write to stream
image
    .png()
    .pipe(someWriteableStream)
// or reszie
image
    .resize(300,300)
    .png()
    .toFile('output300x300.png')
// or use different format
image
    .webp()
    .toFile('output.webp')
```

Install with cli command

```sh
$ npm install -g avatar-generator
$ avatar-generator --help
$ avatar-generator --version
```

## License

Copyright (c) 2018 arusanov  
Licensed under the MIT license.
