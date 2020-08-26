const {
  QWidget,
  QBoxLayout,
  QPlainTextEdit,
  QPushButton,
  QKeyEvent,
  KeyboardModifier,
  Key,
  QFont,
  QComboBox,
  QCheckBox,
  Direction
} = require('@nodegui/nodegui');

const Assets = require('../../assets.js');
const App = require('../../index.js');

class PostBox extends QWidget{
  constructor(){
    super();

    this.assets = new Assets("Postbox");
    this.filters = new Array();
    this.visibilitys = [
     { name: "public", text: "公開" },
     { name: "home", text: "ホーム" },
     { name: "followers", text: "フォロワー" },
     { name: "specified", text: "ダイレクト" },
     { name: "random", text: "ランダム" }
    ];

    this.layout = new QBoxLayout(Direction.LeftToRight);

    this.right = new QWidget();

    this.right_layout = new QBoxLayout(Direction.TopToBottom);

    this.post_button = new QPushButton();
    this.text_input = new QPlainTextEdit();
    this.visibility_select = new QComboBox();
    this.is_local_check = new QCheckBox();

    this.setObjectName('postArea');
    this.setLayout(this.layout);

    this.layout.setContentsMargins(0,5,0,5);
    this.layout.setSpacing(5);

    this.right.setObjectName('postSubArea');
    this.right.setLayout(this.right_layout);

    this.right_layout.setContentsMargins(0,0,0,0);
    this.right_layout.setSpacing(2);

    this.text_input.setObjectName('postTextInput');
    this.text_input.setReadOnly(false);
    this.text_input.setWordWrapMode(3);

    this.post_button.setObjectName('postButton');
    this.post_button.setText('Post!');

    this.visibility_select.setObjectName('postVisibilitySelect');
    this.visibility_select.addItem(undefined, '公開');
    this.visibility_select.addItem(undefined, 'ホーム');
    this.visibility_select.addItem(undefined, 'フォロワー');
    this.visibility_select.addItem(undefined, 'ダイレクト');
    this.visibility_select.addItem(undefined, 'ランダム');

    this.is_local_check.setObjectName('postIsLocalCheck');
    this.is_local_check.setText('ローカルのみ');

    this.post_button.setFixedSize(96,24);
    this.visibility_select.setFixedSize(96,24);
    this.is_local_check.setFixedSize(96,24);

    this.right_layout.addWidget(this.post_button);
    this.right_layout.addWidget(this.visibility_select);
    this.right_layout.addWidget(this.is_local_check);

    this.layout.addWidget(this.text_input, 1);
    this.layout.addWidget(this.right);

    this.update_placeholder();

    this.post_button.addEventListener('clicked', this._post_note.bind(this));
    this.text_input.addEventListener('KeyPress', this._key_parse.bind(this));
  }

  async _post_note(){
    for(var filter of this.filters){
      filter(this.text_input);
    }

    var data = this._get_data();

    if(!data.text){
      App.status_label.setText('本文を入れてね');
      return;
    }

    App.status_label.setText('投稿中...');

    try{
      await App.client.call('notes/create', data);
      this.clear();
      App.status_label.setText("投稿成功!");
    }catch(err){
      console.log(err);
      App.statusLabel.setText(err.error.error.message);
    }

    this.update_placeholder();
  }

  _key_parse(key){
    var _key = new QKeyEvent(key);
    if(_key.modifiers() != KeyboardModifier.ControlModifier) return;
    if(!(
        _key.key() == Key.Key_Enter ||
        _key.key() == Key.Key_Return
    )) return;

    this._post_note();
  }

  _get_data(){
    var visibility = 'public';

    switch(this.visibility_select.currentText()){
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
        var _visibility = ['public', 'home', 'followers', 'specified'];
        visibility = _visibility[Math.floor(Math.random() * _visibility.length)];
    }

    var data = {
      text: this.text_input.toPlainText(),
      visibility: visibility,
      localOnly: this.is_local_check.isChecked()
    }

    return data;
  }

  clear(){
    this.text_input.setPlainText('');
    if(!App.settings.memory_visibility) this.setVisibility(App.settings.start_visibility);
  }

  update_placeholder(){
    var _placeholder = this.assets.placeholder;
    var placeholder = _placeholder[Math.floor(Math.random() * _placeholder.length)];
    this.text_input.setPlaceholderText(placeholder);
  }

  setup(_font){
    const font = new QFont(_font, 9);

    this.text_input.setFont(font);
    this.post_button.setFont(font);
    this.visibility_select.setFont(font);
    this.is_local_check.setFont(font);

    this.setVisibility(App.settings.start_visibility);
  }

  add_post_filter(callback){
    this.filters.push(callback);
  }

  filter(callback){
    callback(this.text_input);
  }

  random_emoji(){
    var emoji = App.random_emoji.exec();
    this.text_input.insertPlainText(emoji);
  }

  setVisibility(vis){
    for(var v of this.visibilitys){
      if(v.name == vis){
        this.visibility_select.setCurrentText(v.text);
      }
    }
  }
}

module.exports = PostBox;
