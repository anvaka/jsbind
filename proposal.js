// This is very generic. Don't think about it in terms of DOM.
// Assume you have an object with fields, and it has
// properties which you want to be bound to data:

var complexObject = {
  text: 'Hello world',
  // This is our custom "change" function. You can think about this as
  // DOM's `setAttributeValue()` method
  changeText: function (newValue) {
    this.text = newValue;
  }
}

// Now let's say you want to bind complexObject.text to `Hello {name}` expression.
// 
// Normally this would require event notification from source (akin to
// Backbone's models), or change polling (like angular.js does)
// 
// Here we take slightly different approach. JavaScript has very dynamic nature
// so why can't we just... compile setter of a model object, when someone wants
// to bind to it. Crazy. But if you think about it, this is exactly the purpose 
// of binding: Update all interested parties as soon as your source is changed
// And since we will be compiling it on the fly, the performance should be
// the same as if you would do this manually in your code.

// So, first we create a helper to do dynamic compilation
var complexObjectBinder = createBinding(function (newValue) {
  this.changeText(newValue);
});

// Second we use it to bind our complex object to a model:
var ourModel = { name: '' };
complexObjectBinder.bind("Hello {name}", complexObject, ourModel);

// now if we update model
ourModel.name = "World ;)!";

// All targets are updated too:
console.log(complexObject.text); // prints "Hello World ;)!"

// Please let me know what you think :)!
// @anvaka

// PS: all magic is done inside this function, which delegates to `jsbind` module
function createBinding(setter) {
  return require('./')(setter);
}
