const {
  QMenu,
  QAction
} = require('@nodegui/nodegui');

const App = require('../index.js');

class PostMenu extends QMenu{
  constructor(){
    super();

    this.random_emoji = new QAction();
    this.emoji_picker = new QAction();
    this.custom_post = new QAction();

    this.setTitle('投稿');

    this.random_emoji.setText('ランダム絵文字');
    this.emoji_picker.setText('絵文字ピッカー');
    this.custom_post.setText('カスタム投稿');

    this.addAction(this.random_emoji);
    this.addAction(this.emoji_picker);
    this.addAction(this.custom_post);

    this.emoji_picker.addEventListener('triggered', () => {
        App.emoji_picker.exec();
        App.emoji_picker.setCloseEvent(function(){
          var result = App.emoji_picker.get_result();
          this.postbox.filter((input) => input.insertPlainText(result));
        }.bind(this));
      }
    );
  }

  set_postbox(postbox){
    this.postbox = postbox;
    this.random_emoji.addEventListener('triggered', () => {
        postbox.random_emoji();
    });
  }

  set_custom_post(custom_post){
    this.custom_post.addEventListener('triggered', () => {
        custom_post.exec({});
    })
  }
}

module.exports = PostMenu;
