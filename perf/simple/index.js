var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

suite.add('Direct call complexObject.changeText()', require('./rawCall'))
.add('Change via binding', require('./binding'))
.add('Change via event notification', require('./events'))
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ 'async': true });


