// This file shows how to create a databinding framework for SVG elements
module.exports.run = function run() {
  var svgBindingRules = require('./svgRules.js'),
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
