const {
  QMenu,
  QAction
} = require('@nodegui/nodegui');

const App = require('../../index.js');

class TimelineMenu extends QMenu{
  constructor(){
    super();

    this.reload_action = new QAction();

    this.setTitle('タイムライン');

    this.reload_action.setText('更新');
    this.reload_action.addEventListener('triggered', () => App.timeline.start_load_tl());


    this.addAction(this.reload_action);
  }
}

module.exports = TimelineMenu;
