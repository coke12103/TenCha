const {
  QMenu,
  QAction
} = require('@nodegui/nodegui');

class PostMenu{
  constructor(){
    const menu = new QMenu();

    const renote_action = new QAction();
    const quote_action = new QAction();
    const reply_action = new QAction();
    const image_view_action = new QAction();
    const note_remove_action = new QAction();

    renote_action.setText('Renote');
    quote_action.setText('引用Renote');
    reply_action.setText('リプライ');
    image_view_action.setText('画像を表示');
    note_remove_action.setText('削除');

    menu.addAction(reply_action);
    menu.addSeparator(renote_action);
    menu.addAction(renote_action);
    menu.addAction(quote_action);
    menu.addSeparator(image_view_action);
    menu.addAction(image_view_action);
    menu.addSeparator(note_remove_action);
    menu.addAction(note_remove_action);

    this.menu = menu;
    this.renote_action = renote_action;
    this.quote_action = quote_action;
    this.reply_action = reply_action;
    this.image_view_action = image_view_action;
    this.note_remove_action = note_remove_action;
  }

  get_widget(){
    return this.menu;
  }

  set_post_action(action){
    this.post_action = action;

    this.renote_action.addEventListener('triggered', () => {
        this.post_action.renote();
    });
    this.image_view_action.addEventListener('triggered', () => {
        this.post_action.image_view();
    });
    this.quote_action.addEventListener('triggered', () => {
        this.post_action.quote();
    });
    this.reply_action.addEventListener('triggered', () => {
        this.post_action.reply();
    });
    this.note_remove_action.addEventListener('triggered', () => {
        this.post_action.note_remove();
    });
  }

  exec(pos){
    this.image_view_action.setEnabled(this.post_action.is_image_view_ready());
    this.note_remove_action.setEnabled(this.post_action.is_remove_ready());

    this.menu.exec(pos);
  }
}

module.exports = PostMenu;
