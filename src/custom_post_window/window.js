const {
  QComboBox,
  QLineEdit,
  QPlainTextEdit,
  QWidget,
  QCheckBox,
  QPushButton,
  WindowType,
  FlexLayout,
  QFont
} = require('@nodegui/nodegui');
const fs = require('fs');
const dateformat = require('dateformat');

const Assets = require("../assets.js");
const ImageArea = require("./image_area.js");
const PollArea = require("./poll_area.js");

class CustomPostWindow{
  constructor(){
    var assets = new Assets("CustomPostWindow");

    var win = new QWidget();
    var winLayout = new FlexLayout();
    win.setLayout(winLayout);
    win.setWindowFlag(WindowType.Window, true);
    // closeEvent を上書きできないので
    win.setWindowFlag(WindowType.WindowCloseButtonHint, false);
    win.setWindowTitle('拡張投稿 - TenCha');
    win.resize(368,430);

    var rootView = new QWidget();
    var rootViewLayout = new FlexLayout();
    rootView.setObjectName('rootView');
    rootView.setLayout(rootViewLayout);
    rootView.setStyleSheet(assets.css);

    // text + postTextAreaSettingArea;
    var postTextArea = new QWidget();
    var postTextAreaLayout = new FlexLayout();
    postTextArea.setObjectName('postTextArea');
    postTextArea.setLayout(postTextAreaLayout);

    // placeholderは別途関数を用意
    var postTextInput = new QPlainTextEdit();
    postTextInput.setObjectName('postTextInput');
    postTextInput.setReadOnly(false);
    postTextInput.setWordWrapMode(3);

    // emoji + visibility + localOnly + viaMobile
    var postTextAreaSettingArea = new QWidget();
    var postTextAreaSettingAreaLayout = new FlexLayout();
    postTextAreaSettingArea.setObjectName('postTextAreaSettingArea');
    postTextAreaSettingArea.setLayout(postTextAreaSettingAreaLayout);

    // var emojiPickerButton = new QPushButton();
    // emojiPickerButton.setText('絵文字');
    // emojiPickerButton.setObjectName('emojiPickerButton');
    //
    // TODO: ランダム絵文字ボタン;


    var visibilitySelect = new QComboBox();
    visibilitySelect.setObjectName('visibilitySelect');

    var isLocalCheck = new QCheckBox();
    isLocalCheck.setObjectName('isLocalCheck');
    isLocalCheck.setText('ローカルのみ');

    var isMobileCheck = new QCheckBox();
    isMobileCheck.setObjectName('isMobileCheck');
    isMobileCheck.setText('モバイルから');

    // cw + visibleUserIdsArea
    var cwTextArea = new QWidget();
    var cwTextAreaLayout = new FlexLayout();
    cwTextArea.setObjectName('cwTextArea');
    cwTextArea.setLayout(cwTextAreaLayout);

    var cwTextInput = new QPlainTextEdit();
    cwTextInput.setObjectName('cwTextInput');
    cwTextInput.setReadOnly(false);
    cwTextInput.setWordWrapMode(3);
    cwTextInput.setPlaceholderText('ここに警告文を入力します');

    var visibleUserIdsInputArea = new QWidget();
    var visibleUserIdsInputAreaLayout = new FlexLayout();
    visibleUserIdsInputArea.setObjectName('visibleUserIdsInputArea');
    visibleUserIdsInputArea.setLayout(visibleUserIdsInputAreaLayout);

    var visibleUserIdsInput = new QPlainTextEdit();
    visibleUserIdsInput.setObjectName('visibleUserIdsInput');
    visibleUserIdsInput.setReadOnly(false);
    visibleUserIdsInput.setWordWrapMode(3);
    visibleUserIdsInput.setPlaceholderText('閲覧を許可するユーザーのID');

    var imageArea = new ImageArea();

    // ReplyIdInput + RenoteIdInput
    var replyRenoteArea = new QWidget();
    var replyRenoteAreaLayout = new FlexLayout();
    replyRenoteArea.setObjectName('replyRenoteArea');
    replyRenoteArea.setLayout(replyRenoteAreaLayout);

    var replyIdInput = new QLineEdit();
    replyIdInput.setPlaceholderText('リプライ先');
    replyIdInput.setObjectName('replyIdInput');

    var renoteIdInput = new QLineEdit();
    renoteIdInput.setPlaceholderText('引用元');
    renoteIdInput.setObjectName('renoteIdInput');

    var pollArea = new PollArea();

    // Post + Clear + Close
    var buttonsArea = new QWidget();
    var buttonsAreaLayout = new FlexLayout();
    buttonsArea.setObjectName('buttonsArea');
    buttonsArea.setLayout(buttonsAreaLayout);

    var postButton = new QPushButton();
    postButton.setObjectName('postButton');
    postButton.setText('投稿');

    var clearButton = new QPushButton();
    clearButton.setObjectName('clearButton');
    clearButton.setText('クリア');

    var closeButton = new QPushButton();
    closeButton.setObjectName('closeButton');
    closeButton.setText('閉じる');

    // rootView
    winLayout.addWidget(rootView);

    // postTextArea + cwTextArea + imageArea + replyRenoteArea + pollArea + buttonsArea
    rootViewLayout.addWidget(postTextArea);
    rootViewLayout.addWidget(cwTextArea);
    rootViewLayout.addWidget(replyRenoteArea);
    rootViewLayout.addWidget(imageArea.widget());
    rootViewLayout.addWidget(pollArea.widget());
    rootViewLayout.addWidget(buttonsArea);

    // text + postTextAreaSettingArea;
    postTextAreaLayout.addWidget(postTextInput);
    postTextAreaLayout.addWidget(postTextAreaSettingArea);

    // cw visibleUserIdsInputArea
    cwTextAreaLayout.addWidget(cwTextInput);
    cwTextAreaLayout.addWidget(visibleUserIdsInputArea);

    // replyIdInput renoteIdInput
    replyRenoteAreaLayout.addWidget(replyIdInput);
    replyRenoteAreaLayout.addWidget(renoteIdInput);

    // postButton + clearButton + closeButton
    buttonsAreaLayout.addWidget(postButton);
    buttonsAreaLayout.addWidget(clearButton);
    buttonsAreaLayout.addWidget(closeButton);

    // emoji + visibility + localOnly + viaMobile
    postTextAreaSettingAreaLayout.addWidget(visibilitySelect);
    postTextAreaSettingAreaLayout.addWidget(isLocalCheck);
    postTextAreaSettingAreaLayout.addWidget(isMobileCheck);

    // visibleUserIdsInput
    visibleUserIdsInputAreaLayout.addWidget(visibleUserIdsInput);

    this.assets = assets;

    this.win = win;
    this.win_layout = winLayout;

    this.root_view = rootView;
    this.root_view_layout = rootViewLayout;

    this.post_text_area = postTextArea;
    this.post_text_area_layout = postTextAreaLayout;

    this.post_text_input = postTextInput;

    this.post_text_area_settings_area = postTextAreaSettingArea;
    this.post_text_area_settings_area_layout = postTextAreaSettingAreaLayout;

    this.visibility_select = visibilitySelect;

    this.is_local_check = isLocalCheck;

    this.is_mobile_check = isMobileCheck;

    this.cw_text_area = cwTextArea;
    this.cw_text_area_layout = cwTextAreaLayout;

    this.cw_text_input = cwTextInput;

    this.visible_user_ids_input_area = visibleUserIdsInputArea;
    this.visible_user_ids_input_area_layout = visibleUserIdsInputAreaLayout;

    this.visible_user_ids_input = visibleUserIdsInput;

    this.image_area = imageArea;

    this.reply_renote_area = replyRenoteArea;
    this.reply_renote_area_layout = replyRenoteAreaLayout;

    this.reply_id_input = replyIdInput;
    this.renote_id_input = renoteIdInput;

    this.poll_area = pollArea;

    this.buttons_area = buttonsArea;
    this.buttons_area_layout = buttonsAreaLayout;

    this.post_button = postButton;
    this.clear_button = clearButton;
    this.close_button = closeButton;

    this.post_button.addEventListener('clicked', () => {
        this.post();
    });
    this.clear_button.addEventListener('clicked', () => {
        this.clear();
    });
    this.close_button.addEventListener('clicked', () => {
        this.hide();
    });
  }

  show(){
    this.win.show();
  }

  hide(){
    this.win.hide();
  }

  set_info( {replyId = "", renoteId = "", visibility = "", visible_user_ids = []} ){
    this.reply_id_input.setText(replyId);
    this.renote_id_input.setText(renoteId);
    // TODO:
    // visibility
    // visible_user_ids
  }

  set_is_hide(callback){
    this.win.addEventListener('Hide', () => {
        callback();
    });
  }

  set_is_post_done(callback){

  }

  set_post_client(client){
    this.client = client;
    this.image_area.set_client(this.client);
  }

  set_random_emoji(emoji_gen){
    this.emoji_gen = emoji_gen;
  }

  set_font(fontname){
    const font = new QFont(fontname, 9);
    this.font = font;

    this.post_text_input.setFont(font);
    this.visibility_select.setFont(font);
    this.is_local_check.setFont(font);
    this.is_mobile_check.setFont(font);
    this.cw_text_input.setFont(font);
    this.visible_user_ids_input.setFont(font);
    this.reply_id_input.setFont(font);
    this.renote_id_input.setFont(font);
    this.post_button.setFont(font);
    this.clear_button.setFont(font);
    this.close_button.setFont(font);

    this.visibility_select_setup();
    this._update_placeholder_text();
    this.image_area.setup(this.font);
    this.poll_area.setup(this.font);
  }

  visibility_select_setup(){
    this.visibility_select.addItem(undefined, '公開');
    this.visibility_select.addItem(undefined, 'ホーム');
    this.visibility_select.addItem(undefined, 'フォロワー');
    this.visibility_select.addItem(undefined, 'ダイレクト');
    this.visibility_select.addItem(undefined, 'ランダム');
  }

  async post(){
    var post_text = this.post_text_input.toPlainText();
    // もしpost_textがなく他のやつも問題があるならreturn;
    if(!post_text) return;
    var cw_text = this.cw_text_input.toPlainText();
    var _visibility = this.visibility_select.currentText();
    var is_local = this.is_local_check.isChecked();
    var is_mobile = this.is_mobile_check.isChecked();
    var visible_user_ids = this.visible_user_ids_input.toPlainText();
    var reply_id = this.reply_id_input.text();
    var renote_id = this.renote_id_input.text();
    // poll
    var poll = this.poll_area.get_poll();

    var visibility = this._parse_visibility(_visibility);

    var data = {
      text: post_text,
      visibility: visibility,
      localOnly: is_local,
      viaMobile: is_mobile
    }

    var files = this.image_area.get_files();

    if(files[0]) data.fileIds = files;

    if(cw_text) data.cw = cw_text;

    //if(visibility == 'specified'){
    //  var v_ids = visible_user_ids.split('\n');
    //  // いい感じにする
    //}
    if(!renote_id && reply_id) data.replyId = reply_id;
    if(!reply_id && renote_id) data.renoteId = renote_id;

    var poll = this.poll_area.get_poll();
    if(poll.choices) data.poll = poll;

    try{
      await this.client.call('notes/create', data);
      this.clear();
      // post done
    }catch(err){
      console.log(err);
    }
  }

  clear(){
    this.post_text_input.setPlainText('');
    this.cw_text_input.setPlainText('');
    this.visible_user_ids_input.setPlainText('');
    this.reply_id_input.setText('');
    this.renote_id_input.setText('');

    this.image_area.clear();
    this.poll_area.clear();
    this._update_placeholder_text();
  }

  _update_placeholder_text(){
    var _placeholder = this.assets.placeholder;
    var placeholder = _placeholder[Math.floor(Math.random() * _placeholder.length)];
    this.post_text_input.setPlaceholderText(placeholder);
  }

  _parse_visibility(_visibility){
    var visibility = 'public';
    switch(_visibility){
      case "公開":
        visibility = 'public';
        break;
      case 'ホーム':
        visibility = 'home';
        break;
      case 'フォロワー':
        visibility = 'followers';
        break;
      case 'ダイレクト':
        visibility = 'specified';
        break;
      case 'ランダム':
        var __visibility = ['public', 'home', 'followers', 'specified'];
        visibility = __visibility[Math.floor(Math.random() * __visibility.length)];
    }

    return visibility;
  }
}

module.exports = CustomPostWindow;
