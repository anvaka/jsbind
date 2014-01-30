module.exports = function createObject() {
  var attributes = {};
  return {
    // This is our custom "change" function. You can think about this as
    // DOM's `setAttributeValue()` method
    setAttributeNS: function (attrName, value) {
      attributes[attrName] = value;
    },

    getAttributeNS: function (attrName) {
      return attributes[attrName];
    }
  };
}
