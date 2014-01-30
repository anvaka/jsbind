var bindingTarget = require('./createObject')();
var createBinding = require('../../');

// let binding framework know how to modify binding target:
var complexObjectBinder = createBinding(function (newValue) {
  this.changeText(newValue);
});

// bind it to our model:
var ourModel = { name: '' };
complexObjectBinder.bind("Hello {name}", bindingTarget, ourModel);

// test itself:
module.exports = function() {
  ourModel.name = new Date();
};
