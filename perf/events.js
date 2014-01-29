var Backbone = require('backbone');
var ComplexModel = Backbone.Model.extend({});
var target = require('./createObject')();

var model = new ComplexModel();

model.on('change:name', function(model, name) {
  target.changeText("Hello " + name);
});

var value = {name : new Date()}

module.exports = function () {
  value.name = new Date();
  model.set(value);
}

