var COUNT = 1000;

module.exports = function () {
  // pretend we are moving
  for (var i = 0; i < objects.length; ++i) {
    var obj = objects[i];
    obj.set('x', obj.x + 1);
    obj.set('y', obj.y + 1);
  }
};

function setup() {
  var objects = [];
  for (var i = 0; i < COUNT; ++i) {
    var target = require('./createObject')();

    target.setAttributeNS('x', i);
    target.setAttributeNS('y', i);

    var object = new ActiveObject(0, 0);
    bind(object, target);
    objects.push(object);
  }
  return objects;
}

function bind(source, target) {
  source.on('x', function (name, newValue) { target.setAttributeNS(name, newValue); });
  source.on('y', function (name, newValue) { target.setAttributeNS(name, newValue); });
}

function ActiveObject(x, y) {
  this.x = x;
  this.y = y;
  this._cb = {};
}

ActiveObject.prototype.on = function (name, cb) {
  var notify = this._cb[name];
  if (!notify) {
    notify = this._cb[name] = [];
  }
  notify.push(cb);
}

ActiveObject.prototype.set = function (name, newValue) {
  this[name] = newValue;
  var notify = this._cb[name];
  if (notify) {
    for (var i = 0; i < notify.length; ++i) {
      notify[i](name, newValue);
    }
  }
}

var objects = setup();
