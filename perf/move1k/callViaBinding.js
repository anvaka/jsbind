var COUNT = 1000;
var jsbind = require('../../');
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
    var model = { x: 1, y: 1};
    bind(target, model);
    objects.push(model);
  }
  return objects;
}

function bind(node, model) {
  bindAttribute(node, 'x', '{x}', model);
  bindAttribute(node, 'y', '{y}', model);
}

function bindAttribute(target, targetPropertyName, bindingExpression, model) {
  var binder = jsbind(function(newValue) {
    target.setAttributeNS(targetName, newValue);
  });

  binder.bind(bindingExpression, target, targetPropertyName, model);
}
