var COUNT = 1000;
var objects = setup();

module.exports = function () {
  // pretend we are moving
  for (var i = 0; i < objects.length; ++i) {
    var obj = objects[i];
    var x = obj.getAttributeNS('x') + 1;
    obj.setAttributeNS('x', x);
    var y = obj.getAttributeNS('y') + 1;
    obj.setAttributeNS('y', y);
  }
};

function setup() {
  var objects = [];
  for (var i = 0; i < COUNT; ++i) {
    var obj = require('./createObject')();
    obj.setAttributeNS('x', i);
    obj.setAttributeNS('y', i);
    objects.push(obj);
  }
  return objects;
}
