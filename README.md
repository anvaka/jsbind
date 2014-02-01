# jsbind

Runtime javascript data binding.

After playing with idea below for a while, I realized properties are much slower than method call (no matter whether they are dynamically compiled or not). I maybe come back to this some time in future.

# Idea

This is a very generic data binding library. Please don't think about it in terms of DOM.
Assume you have an object and its properties are modified via methods. Somewhat similar to DOM's `setAttributeValue()` here we use `changeText()` to change the text value:

``` js
var complexObject = {
  text: 'Hello world',
  changeText: function (newValue) {
    this.text = newValue;
  }
}
```

Let's say we want to bind `complexObject.text` to `Hello {name}` expression. Normally this is solved in two ways:

1. Event notification from source (akin to Backbone's models),
2. Or poll binding sources to detect changes (like angular.js does)

**IDEA:** JavaScript has very dynamic nature so why can't we just... compile setter of a model object, when someone wants to bind to it.

I thought it's crazy, but wait, this is what [one-way] bindings are supposed to do. Update all targets as soon as source is changed.

Since we are compiling on the fly, we can do all sorts of optimizations. In fact look at early [performance test](https://github.com/anvaka/jsbind/tree/master/perf) results:

```
Direct call complexObject.changeText() x 1,153,478 ops/sec ±1.26% (87 runs sampled)
Change via binding x 1,128,089 ops/sec ±1.44% (88 runs sampled)
```

# Binding API

### this will be changed

First: Create a helper to do dynamic compilation:

``` js
var createBinding = require('jsbind'); // our magic binding library

var complexObjectBinder = createBinding(function (newValue) {
  // This method teaches binding library how to update targets.
  // In our case, just call `changeText` with newValue
  this.changeText(newValue);
});
```

Second: Bind our complex object to a model:

``` js
var ourModel = { name: '' };
complexObjectBinder.bind("Hello {name}", complexObject, ourModel);

// now if we update model
ourModel.name = "World ;)!";

// All targets are updated too:
console.log(complexObject.text); // prints "Hello World ;)!"
```

Please let me know what you think :)!

# install

With [npm](https://npmjs.org) do:

```
npm install jsbind
```

# license

MIT
