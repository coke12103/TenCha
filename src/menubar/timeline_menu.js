const {
  QMenu,
  QAction
} = require('@nodegui/nodegui');

class TimelineMenu{
  constructor(){
    const menu = new QMenu();
    menu.setTitle('タイムライン');

    const renote_action = new QAction();
    renote_action.setText('リノート');

    menu.addAction(renote_action);

    this.menu = menu;
    this.renote_action = renote_action;
  }

  get_widget(){
    return this.menu;
  }

  set_post_action(action){
    this.renote_action.addEventListener('triggered', () => {
        action.renote();
    })
  }
}

module.exports = TimelineMenu;
