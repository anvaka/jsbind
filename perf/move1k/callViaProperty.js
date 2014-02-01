var COUNT = 1000;
var objects = setup();

module.exports = function () {
  // pretend we are moving
  for (var i = 0; i < objects.length; ++i) {
    var obj = objects[i];
    obj.x += 1;
    obj.y += 1;
  }
};

function setup() {
  var objects = [];
  for (var i = 0; i < COUNT; ++i) {
    var target = require('./createObject')();

    target.setAttributeNS('x', i);
    target.setAttributeNS('y', i);

    var object = {
      x: 0, y: 0
    };

    bind(object, target);
    objects.push(object);
  }
  return objects;
}

function bind(source, target) {
  Object.defineProperty(source, 'x', {
    get : function () { return target.getAttributeNS('x'); },
    set : function (newValue) { return target.setAttributeNS('x', newValue); }
  });
  Object.defineProperty(source, 'y', {
    get : function () { return target.getAttributeNS('y'); },
    set : function (newValue) { return target.setAttributeNS('y', newValue); }
  });
}
