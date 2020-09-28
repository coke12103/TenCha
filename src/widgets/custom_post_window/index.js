const {
  QLineEdit,
  QWidget,
  WindowType,
  QBoxLayout,
  QFont,
  Direction
} = require('@nodegui/nodegui');

const ImageArea = require("./image_area.js");
const PollArea = require("./poll_area.js");
const PostTextArea = require("./post_text_area.js");
const CwTextArea = require("./cw_text_area.js");
const ButtonArea = require("./button_area.js");
const App = require('../../index.js');

class CustomPostWindow extends QWidget{
  constructor(){
    super();

    this.random_emoji = App.random_emoji;

    this.layout = new QBoxLayout(Direction.TopToBottom);

    this.target_area = new QWidget();

    this.target_area_layout = new QBoxLayout(Direction.LeftToRight);

    this.reply_id_input = new QLineEdit();
    this.renote_id_input = new QLineEdit();

    this.post_text_area = new PostTextArea();
    this.cw_text_area = new CwTextArea();
    this.image_area = new ImageArea();
    this.poll_area = new PollArea();
    this.buttons_area = new ButtonArea();

    this.setLayout(this.layout);
    this.setWindowFlag(WindowType.Window, true);
    //this.setWindowFlag(WindowType.WindowCloseButtonHint, false);
    this.setWindowTitle('拡張投稿 - TenCha');
    this.resize(368,430);
    this.setObjectName('rootView');
    //this.setStyleSheet(assets.css);

    this.layout.setContentsMargins(5,5,5,5);
    this.layout.setSpacing(5);

    this.target_area.setObjectName('replyRenoteArea');
    this.target_area.setLayout(this.target_area_layout);

    this.target_area_layout.setContentsMargins(0,0,0,0);
    this.target_area_layout.setSpacing(5);

    this.reply_id_input.setPlaceholderText('リプライ先');
    this.reply_id_input.setObjectName('replyIdInput');

    this.renote_id_input.setPlaceholderText('引用先');
    this.renote_id_input.setObjectName('renoteIdInput');

    this.target_area_layout.addWidget(this.reply_id_input);
    this.target_area_layout.addWidget(this.renote_id_input);

    this.layout.addWidget(this.post_text_area);
    this.layout.addWidget(this.cw_text_area);
    this.layout.addWidget(this.target_area);
    this.layout.addWidget(this.image_area);
    this.layout.addWidget(this.poll_area);
    this.layout.addWidget(this.buttons_area);

    this.buttons_area.post_button.addEventListener('clicked', this.post.bind(this));
    this.buttons_area.clear_button.addEventListener('clicked', this.clear.bind(this));
    this.buttons_area.close_button.addEventListener('clicked', this.close.bind(this));

    this.poll_area.reset_exp_date_time();
    this.post_text_area.updatePlaceholder();
  }

  setup(){
    this.font = new QFont(App.settings.get("font"), 9);

    this.post_text_area.setFont(this.font);
    this.cw_text_area.setFont(this.font);
    this.image_area.setFont(this.font);
    this.poll_area.setFont(this.font);
    this.reply_id_input.setFont(this.font);
    this.renote_id_input.setFont(this.font);
    this.buttons_area.setFont(this.font);
  }

  exec(data){
    this.clear();

    if(!this.isVisible()) this.show();

    if(data.text) this.post_text_area.setText(data.text);
    if(data.cw) this.cw_text_area.setText(data.cw);
    if(data.viaMobile) this.post_text_area.setViaMobile(data.viaMobile);
    if(data.files) for(var f of data.files) this.image_area.insertFile(f);
    if(data.poll) this.poll_area.setPoll(data.poll);

    if(data.replyId) this.reply_id_input.setText(data.replyId);
    if(data.renoteId) this.renote_id_input.setText(data.renoteId);

    if(data.visibility){
      this.post_text_area.setVisibility(data.visibility);
      if(
        data.visibility == "specified"
        && data.visible_user_ids
      ) this.cw_text_area.setVisbleUserIds(data.visible_user_ids);
    }
  }

  async post(){
    var post_area_info = this.post_text_area.getInfo();
    var cw_area_info = this.cw_text_area.getInfo();
    var reply_id = this.reply_id_input.text();
    var renote_id = this.renote_id_input.text();
    var poll = this.poll_area.get_poll();
    var files = this.image_area.get_files();

    // 投稿していいか
    if(!post_area_info.text && !files[0] && !poll.choices) return;

    var data = post_area_info;

    if(files[0]) data.fileIds = files;
    if(cw_area_info.cw) data.cw = cw_area_info.cw;
    if(post_area_info.visibility == 'specified' && cw_area_info.visibleUserIds) data.visibleUserIds = cw_area_info.visibleUserIds;
    if(!renote_id && reply_id) data.replyId = reply_id;
    if(!reply_id && renote_id) data.renoteId = renote_id;
    if(poll.choices) data.poll = poll;

    try{
      App.status_label.setText('投稿中...');
      await App.client.call('notes/create', data);
      this.clear();
      if(!this.buttons_area.is_after_close_check.isChecked()) this.hide();
      App.status_label.setText('投稿成功!');
    }catch(err){
      console.log(err);
      App.status_label.setText(`投稿失敗...(${err.error.error.message})`);
    }
  }

  clear(){
    this.post_text_area.clear();
    this.cw_text_area.clear();
    this.reply_id_input.clear();
    this.renote_id_input.clear();
    this.image_area.clear();
    this.poll_area.clear();
    this.post_text_area.updatePlaceholder();
  }
}

module.exports = CustomPostWindow;
