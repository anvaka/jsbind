var complexObject = require('./createObject')();

module.exports = function () {
  complexObject.changeText( "Hello " + new Date());
};
