const {
  QMenuBar
} = require('@nodegui/nodegui');

const FileMenu = require('./file_menu.js');

class MenuBar{
  constructor(){
    const bar = new QMenuBar();
    const file_menu = new FileMenu();

    bar.addMenu(file_menu.get_widget());

    this.bar = bar;
    this.file_menu = file_menu;
  }

  get_widget(){
    return this.bar;
  }
}

module.exports = MenuBar
