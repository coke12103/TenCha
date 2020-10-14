const {
  QMenuBar,
  QFont
} = require('@nodegui/nodegui');

const FileMenu = require('./file_menu.js');
const PostMenu = require('./post_menu.js');
const OperationMenu = require('../widgets/operation_menu/index.js');

class MenuBar extends QMenuBar{
  constructor(){
    super();

    this.file_menu = new FileMenu();
    this.post_menu = new PostMenu();
    this.operation_menu = new OperationMenu();

    this.addMenu(this.file_menu);
    this.addMenu(this.post_menu);
    this.addMenu(this.operation_menu);
  }

  init(){
    this.operation_menu.init();
  }

  setFont(fontname){
    this.font = new QFont(fontname, 9);

    super.setFont(this.font);

    this.file_menu.setFont(this.font);
    this.post_menu.setFont(this.font);
    this.operation_menu.setFont(this.font);
  }
}

module.exports = MenuBar;
