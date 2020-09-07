const {
  QMenu,
  QAction
} = require('@nodegui/nodegui');

const App = require('../index.js');

class FileMenu extends QMenu{
  constructor(){
    super();

    this.setting_action = new QAction();
    this.exit_action = new QAction();

    this.setTitle('ファイル');

    this.setting_action.setText('設定');
    this.setting_action.addEventListener('triggered', () => {
        App.setting_window.exec();
    });

    this.exit_action.setText('終了');
    this.exit_action.addEventListener('triggered', () => process.exit(0));

    this.addAction(this.setting_action);
    this.addSeparator(this.exit_action);
    this.addAction(this.exit_action);
  }
}

module.exports = FileMenu;
