module.exports = createBinding;

var registeredBindings = {},
    jsBindId = 0;

function createBinding(setter) {
  var setterBody = getFunctionBody(setter);

  return {
    bind: function (expression, target, source) {
      recompile(expression, target, source);
    }
  };

  function recompile(expression, target, source) {
    var currentBindings = registeredBindings[source.__jsbindId];
    if (!currentBindings) {
      source.__jsbindId = jsBindId++;
      currentBindings = {
        code: []
      };
    }

    var parsedExpression = parseExpression(expression);

    var code = parsedExpression.code + setterBody;
    for (var i = 0; i < parsedExpression.keys.length; ++i) {
      createProperties(source, parsedExpression.keys[i], target, code);
    }
  }
}

function createProperties(source, name, target, setterBody){
  var value = source[name];
  Object.defineProperty(source, name, {
    get: function () { return value; },
    set: compileSetter(setterBody).bind(target)
  })
}

function compileSetter(setterCode) {
  return (new Function('newValue', setterCode));
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
