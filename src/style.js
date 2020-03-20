const file = require('./file.js');

var style = {};

style.add_style = function(view, path){
  var style = file.load(path)
  if(!style) return;

  view.setStyleSheet(style);
}

module.exports = style;
