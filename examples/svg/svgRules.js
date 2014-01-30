module.exports.bind = bind;

function bind(node, model) {
  for (var i = 0; i < node.attributes.length; ++i) {
    var attribute = node.attributes[i];
    if (isBoundAttribute(attribute)) {
      bindAttribute(node, attribute.nodeName.substr(2), attribute.nodeValue, model);
    }
  }
}

var jsbind = require('../../');
function bindAttribute(target, targetPropertyName, bindingExpression, model) {
  var binder = jsbind(function() {
    this.setAttributeNS(null, targetName, newValue);
  });

  binder.bind(bindingExpression, target, targetPropertyName, model);
}

function isBoundAttribute(attr) {
  return attr.nodeName[0] === 's' && attr.nodeName[1] === ':';
}
