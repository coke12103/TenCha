const {
  QMenu,
  QAction
} = require('@nodegui/nodegui');

class PostMenu{
  constructor(){
    const menu = new QMenu();
    menu.setTitle('投稿');

    const random_emoji_action = new QAction();
    random_emoji_action.setText('ランダム絵文字');

    menu.addAction(random_emoji_action);

    this.menu = menu;
    this.random_emoji_action = random_emoji_action;
  }

  get_widget(){
    return this.menu;
  }

  set_random_emoji(random_emoji){
    this.random_emoji_action.addEventListener('triggered', () => {
        random_emoji.exec();
    })
  }
}

module.exports = PostMenu;
