const { QCheckBox } = require("@nodegui/nodegui");

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
}

module.exports = Checkboxs;
