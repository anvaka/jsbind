var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

suite.add('Move via event listener', require('./callViaEvent'))
  .add('Direct call obj.setAttributeNS()', require('./rawCall'))
  .add('Move via property', require('./callViaProperty'))
  .add('Move via bound property', require('./callViaBinding'))

//.add('Change via event notification', require('./events'))
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ 'async': true });


