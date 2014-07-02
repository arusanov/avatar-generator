# avatar-generator [![Build Status](https://secure.travis-ci.org/arusanov/avatar-generator.png?branch=master)](http://travis-ci.org/arusanov/avatar-generator)

8bit avatar generator like one below. 

![Like this one](http://eightbitavatar.herokuapp.com/?id=@arusanov&s=male&size=150)

Inspired by https://github.com/matveyco/8biticon (icons also theirs).
Generate same icons for same ids like gravatar, 
Use email or md5 or any string for generating and get the same avatar.

## Demo

http://eightbitavatar.herokuapp.com/?id=userid&s=male&size=400

Where:
id - your user id
s - sex (male|female)
size - avatar size

## Getting Started

Install the module with: `npm install avatar-generator`

```js
var avatar-generator = require('avatar-generator');
avatar.generate('User ID (email or hash or any string)', 'male|female', 400).stream().pipe(stream);
```

Install with cli command

```sh
$ npm install -g avatar-generator
$ avatar-generator --help
$ avatar-generator --version
```


## Documentation

Project uses **imagemagick** so make sure it's installed and available in $PATH.
You can customize path to imagemagick **convert** command using `settings.js`
 
```js
module.exports = {
  order:'background face clothes head hair eye mouth'.split(' '), //order in which sprites should be combined
  images:require('path').join(__dirname,'./img'), // path to sprites 
  convert:'convert' //Path to imagemagick convert 
};
```

Generator uses avatars layers in `img` 
You can easily add your own if you want.



## Examples

see `example/file_example.js` and `example/webserver-exapmle.js`


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com).


## License

Copyright (c) 2014 Alex R  
Licensed under the MIT license.
