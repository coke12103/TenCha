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

    const custom_post_action = new QAction();
    custom_post_action.setText('カスタム投稿');

    menu.addAction(random_emoji_action);
    menu.addAction(custom_post_action);

    this.menu = menu;
    this.random_emoji_action = random_emoji_action;
    this.custom_post_action = custom_post_action;
  }

  get_widget(){
    return this.menu;
  }

  set_postbox(postbox){
    this.random_emoji_action.addEventListener('triggered', () => {
        postbox.random_emoji();
    })
  }

  set_custom_post(custom_post){
    this.custom_post_action.addEventListener('triggered', () => {
        custom_post.exec({});
    })
  }
}

module.exports = PostMenu;
