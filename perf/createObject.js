module.exports = function createObject() {
  return {
    text: 'Hello world',
    // This is our custom "change" function. You can think about this as
    // DOM's `setAttributeValue()` method
    changeText: function (newValue) {
      this.text = newValue;
    }
  };
}
