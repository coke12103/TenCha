const {
  QMenuBar
} = require('@nodegui/nodegui');

const FileMenu = require('./file_menu.js');
const PostMenu = require('./post_menu.js');
const TimelineMenu = require('./timeline_menu.js');

class MenuBar{
  constructor(){
    const bar = new QMenuBar();
    const file_menu = new FileMenu();
    const post_menu = new PostMenu();
    const timeline_menu = new TimelineMenu();

    bar.addMenu(file_menu.get_widget());
    bar.addMenu(post_menu.get_widget());
    bar.addMenu(timeline_menu.get_widget());

    this.bar = bar;
    this.file_menu = file_menu;
    this.post_menu = post_menu;
    this.timeline_menu = timeline_menu;
  }

  get_widget(){
    return this.bar;
  }
}

module.exports = MenuBar;
