const {
  QMenu,
  QAction
} = require('@nodegui/nodegui');

class FileMenu{
  constructor(){
    const menu = new QMenu();
    menu.setTitle('ファイル');

    const exit_action = new QAction();
    exit_action.setText('終了');
    exit_action.addEventListener('triggered', () => {
        process.exit(0);
    })

    menu.addAction(exit_action);

    this.menu = menu;
    this.exit_action = exit_action;
  }

  get_widget(){
    return this.menu;
  }
}

module.exports = FileMenu;
