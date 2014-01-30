module.exports = createBinding;

function createBinding(setter) {
  var setterBody = getFunctionBody(setter);

  return {
    bind: bind
  };

  function bind(expression, target, source) {
    var parsedExpression = parseExpression(expression);

    var code = parsedExpression.code + setterBody;
    for (var i = 0; i < parsedExpression.keys.length; ++i) {
      createProperties(source, parsedExpression.keys[i], target, code);
    }
  }
}

function createProperties(source, name, target, setterBody){
  var value = source[name];
  setterBody = setterBody.replace(/\bthis\b/g, 'target');
  var setter = compileSetter(setterBody)(target);
  Object.defineProperty(source, name, {
    get: function () { return value; },
    set: setter
  });
}

function compileSetter(setterCode) {
  return (new Function('target',
         " return function(newValue) {" + setterCode + "} "));
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
