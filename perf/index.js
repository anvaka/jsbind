var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

suite.add('Raw call to complex object', require('./rawCall'))
.add('Change via binding', require('./binding'))
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ 'async': true });


