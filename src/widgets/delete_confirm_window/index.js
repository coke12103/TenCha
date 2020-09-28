const {
  QMessageBox,
  QPushButton,
  ButtonRole,
  QFont
} = require("@nodegui/nodegui");

const App = require('../../index.js');

class DeleteConfirmWindow extends QMessageBox{
  constructor(note, is_repost = false){
    super();

    this.accept = new QPushButton();
    this.reject = new QPushButton();

    this.setText(`失った信頼はもう戻ってきませんが、このノートを削除しますか？\n\n> ${note.text}`);

    this.accept.setText("おk");
    this.reject.setText("やめとく");

    this.addButton(this.reject, ButtonRole.RejectRole);
    this.addButton(this.accept, ButtonRole.AcceptRole);

    this.setFont(new QFont(App.settings.get('font'), 9));
    this.accept.setFont(new QFont(App.settings.get('font'), 9));
    this.reject.setFont(new QFont(App.settings.get('font'), 9));

    this.accept.addEventListener('clicked', () => {
        App.post_action._note_remove(note);
        App.status_label.setText("削除しました!");

        if(is_repost){
          var data = {};

          // TODO: isLocal
          if(note.no_emoji_text) data.text = note.no_emoji_text;
          if(note.no_emoji_cw) data.cw = note.no_emoji_cw;
          if(note.viaMobile) data.viaMobile = note.viaMobile;
          if(note.files) data.files = note.files;
          if(note.poll) data.poll = note.poll;
          if(note.replyId) data.replyId = note.replyId;
          if(note.renoteId) data.renoteId = note.renoteId;
          data.visibility = note.visibility;
          if(note.visibleUserIds) data.visible_user_ids = note.visibleUserIds;

          App.custom_post_window.exec(data);
        }
        this.close();
    });
    this.reject.addEventListener('clicked', () => {
        this.close();
    });
  }

  close(){
    this.accept.close();
    this.reject.close();

    this.accept = undefined;
    this.reject = undefined;

    super.close();
  }
}

module.exports = DeleteConfirmWindow;
