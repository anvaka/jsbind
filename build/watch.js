var fs = require('fs');
var gaze = require('gaze');
var b = require('browserify')();
b.add('./examples/svg/index.js');
build();

gaze(['examples/svg/*.js', '!examples/svg/bundle.js'], function () {
  console.log(this.watched());

  this.on('all', function(event, filepath) {
    console.log(event, filepath);
    build();
  });
});


function build() {
  b.bundle({standalone: 'svgdemo'}).pipe(fs.createWriteStream('./examples/svg/bundle.js'));
}
