const {
  QMenu,
  QAction
} = require('@nodegui/nodegui');

const App = require('../../index.js');
const ReactionMenu = require('../../widgets/reaction_menu/index.js');

class TimelineMenu extends QMenu{
  constructor(){
    super();

    this.reaction_menu = new ReactionMenu();

    this.reaction_action = new QAction();
    this.renote_action = new QAction();
    this.quote_action = new QAction();
    this.reply_action = new QAction();
    this.image_view_action = new QAction();
    this.favorite_action = new QAction();
    this.note_remove_action = new QAction();

    this.setTitle('タイムライン');

    this.reaction_action.setText('リアクション');
    this.reaction_action.setMenu(this.reaction_menu);

    this.renote_action.setText('Renote');
    this.quote_action.setText('引用Renote');
    this.reply_action.setText('リプライ');
    this.image_view_action.setText('画像を表示');
    this.favorite_action.setText('お気に入り');
    this.note_remove_action.setText('削除');

    this.addAction(this.reaction_action);
    this.addSeparator(this.reply_action);

    this.addAction(this.reply_action);
    this.addSeparator(this.renote_action);

    this.addAction(this.renote_action);
    this.addAction(this.quote_action);
    this.addSeparator(this.favorite_action);

    this.addAction(this.favorite_action);
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
    this.favorite_action.addEventListener('triggered', () => App.post_action.favorite());

    this.addEventListener('Show', function(){
        this.image_view_action.setEnabled(App.post_action.is_image_view_ready());
        this.note_remove_action.setEnabled(App.post_action.is_remove_ready());
    }.bind(this));
  }

  init(){
    this.reaction_menu.init();
  }
}

module.exports = TimelineMenu;
