const {
  QMenu,
  QAction
} = require('@nodegui/nodegui');
const App = require('../index.js');

class PostMenu extends QMenu{
  constructor(){
    super();

    this.renote_action = new QAction();
    this.quote_action = new QAction();
    this.reply_action = new QAction();
    this.image_view_action = new QAction();
    this.note_remove_action = new QAction();

    this.renote_action.setText('Renote');
    this.quote_action.setText('引用Renote');
    this.reply_action.setText('リプライ');
    this.image_view_action.setText('画像を表示');
    this.note_remove_action.setText('削除');

    this.addAction(this.reply_action);
    this.addSeparator(this.renote_action);

    this.addAction(this.renote_action);
    this.addAction(this.quote_action);
    this.addSeparator(this.image_view_action);

    this.addAction(this.image_view_action);
    this.addSeparator(this.note_remove_action);

    this.addAction(this.note_remove_action);

    this.renote_action.addEventListener('triggered', () => {
        App.post_action.renote();
    });
    this.image_view_action.addEventListener('triggered', () => {
        App.post_action.image_view();
    });
    this.quote_action.addEventListener('triggered', () => {
        App.post_action.quote();
    });
    this.reply_action.addEventListener('triggered', () => {
        App.post_action.reply();
    });
    this.note_remove_action.addEventListener('triggered', () => {
        App.post_action.note_remove();
    });
  }

  exec(pos){
    this.image_view_action.setEnabled(App.post_action.is_image_view_ready());
    this.note_remove_action.setEnabled(App.post_action.is_remove_ready());

    super.exec(pos);
  }
}

module.exports = PostMenu;
