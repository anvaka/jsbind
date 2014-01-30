!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.svgdemo=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
// This file shows how to create a databinding framework for SVG elements
module.exports.run = function run() {
  var svgBindingRules = _dereq_('./svgRules.js'),
      models = [];

  forEachBindingTarget(bindToModel);

  renderFrame();

  function bindToModel(node) {
    var model = createModel();
    svgBindingRules.bind(node, model);
    models.push(model);
    for (var i = 0; i < 1000; ++i) {
      model = createModel();
      var clone = node.cloneNode();
      var scene = node.parentNode.appendChild(clone);
      svgBindingRules.bind(clone, model);
      models.push(model);
    }
  }

  function renderFrame() {
    requestAnimationFrame(renderFrame);
    for (var i = 0; i < models.length; ++i) {
      var model = models[i];
      var x = model.x + model.dx;
      if (0 > x || x > 640) { model.dx *= -1; x = model.x + model.dx; }

      var y = model.y + model.dy;
      if (0 > y || y > 480) { model.dy *= -1; y = model.y + model.dy; }

      model.x = x; model.y = y;
    }
  }
};

function forEachBindingTarget(cb) {
  // get all elements that have attributes, started with 's:'
  var snapshot = document.evaluate("//*[@*[starts-with(name(.), 's:')]]",
                    document.body, null,
                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

  for (var i = 0; i < snapshot.snapshotLength; ++i) {
    cb(snapshot.snapshotItem(i));
  }
}

function createModel() {
 return {
   x: Math.random() * 100,
   y: Math.random() * 100,
   r: Math.random() * 10 + 1,
   dx: Math.random() * 10 + 1,
   dy: Math.random() * 10 + 1,
   color: getNiceColor()
 };
}

var niceColors = [
  '#1f77b4', '#aec7e8',
  '#ff7f0e', '#ffbb78',
  '#2ca02c', '#98df8a',
  '#d62728', '#ff9896',
  '#9467bd', '#c5b0d5',
  '#8c564b', '#c49c94',
  '#e377c2', '#f7b6d2',
  '#7f7f7f', '#c7c7c7',
  '#bcbd22', '#dbdb8d',
  '#17becf', '#9edae5'
];

function getNiceColor() {
  return niceColors[(Math.random() * niceColors.length)|0];
}

},{"./svgRules.js":2}],2:[function(_dereq_,module,exports){
module.exports.bind = bind;

function bind(node, model) {
  for (var i = 0; i < node.attributes.length; ++i) {
    var attribute = node.attributes[i];
    if (isBoundAttribute(attribute)) {
      bindAttribute(node, attribute.nodeName.substr(2), attribute.nodeValue, model);
    }
  }
}

var jsbind = _dereq_('../../');
function bindAttribute(target, targetPropertyName, bindingExpression, model) {
  var binder = jsbind(function() {
    this.setAttributeNS(null, targetName, newValue);
  });

  binder.bind(bindingExpression, target, targetPropertyName, model);
}

function isBoundAttribute(attr) {
  return attr.nodeName[0] === 's' && attr.nodeName[1] === ':';
}

},{"../../":3}],3:[function(_dereq_,module,exports){
module.exports = createBinding;

function createBinding(setter) {
  var setterBody = getFunctionBody(setter);
  setterBody = setterBody.replace(/\bthis\b/g, 'target');

  return {
    bind: bind
  };

  function bind(expression, target, targetName, source) {
    if (source === undefined) {
      source = targetName;
      targetName = '';
    }

    var parsedExpression = parseExpression(expression);
    var code = parsedExpression.code + setterBody;
    for (var i = 0; i < parsedExpression.keys.length; ++i) {
      createProperties(source, parsedExpression.keys[i], target, targetName, code);
    }
  }
}

function createProperties(source, name, target, targetName, setterBody){
  var value = source[name];
  Object.defineProperty(source, name, compileMethods(setterBody)(value, target, targetName));
  source[name] = value; // trigger binding;
}

function compileMethods(setterCode) {
  return new Function('oldValue', 'target', 'targetName', [
' return {',
'   get: function() { return oldValue; },',
'   set: function(newValue) {',
'      oldValue = newValue;',
       setterCode,
'      }',
' };'].join('\n')
  );
}

function getFunctionBody(func) {
  var code = func.toString();
  var start = code.indexOf('{') + 1;
  var end = code.lastIndexOf('}');
  return code.substr(start, end - start);
}

function parseExpression(expr) {
  // we do not support multiple {} yet
  var keys = [];
  var bindingCode = expr.replace(/{([^}]+?)}/g, function (_, key) {
    keys.push(key);
    return '\" + newValue + \"';
  });

  // todo: this doesn't have to be hardcoded and be always a string
  return {
    keys: keys,
    code: 'newValue = "' + bindingCode + '";'
  };
}

},{}]},{},[1])
(1)
});