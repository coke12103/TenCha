const { QCheckBox, QFont } = require("@nodegui/nodegui");

class Checkboxs{
  constructor(){
    var timelineAutoSelect = new QCheckBox();
    timelineAutoSelect.setObjectName('timelineAutoSelect');
    timelineAutoSelect.setText('最新の投稿を追う');

    this.timeline_auto_select = timelineAutoSelect;
  }

  get(name){
    return this[name];
  }

  set_font(_font){
    const font = new QFont(_font, 9);

    this.timeline_auto_select.setFont(font);
  }
}

module.exports = Checkboxs;
