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
