const file = require('../file.js');
const Window = require('./window.js');
const message_box = require('../message_box.js');

class CustomPost{
  constructor(){
    this.is_show = false;
    this.win = new Window();
    // hideされたらis_showをいじるようにする
    this.win.set_is_hide(function(){ this.is_show = false; }.bind(this));
  }

  async show({ replyId = "", renoteId = "", visibility = "", visible_user_ids = [] }){
    this.win.set_info({ replyId: replyId, renoteId: renoteId, visibility: visibility, visible_user_ids: visible_user_ids });
    if(this.is_show){
      return;
    }

    this.is_show = true;
    // 表示させる。
    this.win.show();
  }

  set_client(client){
    this.win.set_post_client(client);
  }

  set_status_label(status_label){
    this.status_label = status_label;
    this.win.set_is_post_done(function(){ this.status_label.setText('投稿成功!'); }.bind(this));
  }

  set_postbox(postbox){
    this.postbox = postbox;
  }

  set_font(fontname){
    this.win.set_font(fontname);
  }
}

module.exports = CustomPost;
