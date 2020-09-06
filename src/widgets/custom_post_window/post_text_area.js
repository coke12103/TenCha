const {
  QWidget,
  QBoxLayout,
  Direction,
  QPlainTextEdit,
  QComboBox,
  // QPushButton,
  QCheckBox
} = require('@nodegui/nodegui');

const Assets = require("../../assets.js");
const App = require("../../index.js");

class PostTextArea extends QWidget{
  constructor(){
    super();

    this.assets = new Assets("CustomPostWindow");

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

    this.text_input = new QPlainTextEdit();
    //this.emoji_pick_button = new QPushButton();
    //this.random_emoji_button = new QPushButton();
    this.visibility_select = new QComboBox();
    this.is_local_check = new QCheckBox();
    this.is_mobile_check = new QCheckBox();

    this.setLayout(this.layout);
    this.setObjectName('postTextArea');

    this.layout.setContentsMargins(0,0,0,0);
    this.layout.setSpacing(5);

    this.right.setObjectName('postTextAreaSettingArea');
    this.right.setLayout(this.right_layout);

    this.right_layout.setContentsMargins(0,0,0,0);
    this.right_layout.setSpacing(3);

    this.text_input.setObjectName('postTextInput');
    this.text_input.setReadOnly(false);
    this.text_input.setWordWrapMode(3);

//    this.emoji_pick_button.setText('絵文字');
//    this.emoji_pick_button.setObjectName('emojiPickerButton');

//    this.random_emoji_button.setText('ランダム絵文字');
//    this.random_emoji_button.setObjectName('randomEmojiButton');

    this.visibility_select.setObjectName('visibility_select');
    for(var vis of this.visibilitys){
      this.visibility_select.addItem(undefined, vis.text);
    }

    this.is_local_check.setObjectName('isLocalCheck');
    this.is_local_check.setText('ローカルのみ');

    this.is_mobile_check.setObjectName('isMobileCheck');
    this.is_mobile_check.setText('モバイルから');

    this.right_layout.addWidget(this.visibility_select);
    this.right_layout.addWidget(this.is_local_check);
    this.right_layout.addWidget(this.is_mobile_check);
//    this.right_layout.addWidget(this.emoji_pick_button);
//    this.right_layout.addWidget(this.random_emoji_button);

    this.layout.addWidget(this.text_input, 1);
    this.layout.addWidget(this.right);
  }

  setFont(font){
    this.text_input.setFont(font);
    this.visibility_select.setFont(font);
    this.is_local_check.setFont(font);
    this.is_mobile_check.setFont(font);

    this.setVisibility(App.settings.get("start_visibility"));
  }

  setVisibility(vis){
    for(var v of this.visibilitys){
      if(v.name == vis){
        this.visibility_select.setCurrentText(v.text);
      }
    }
  }

  updatePlaceholder(){
    var _placeholder = this.assets.placeholder;
    var placeholder = _placeholder[Math.floor(Math.random() * _placeholder.length)];
    this.text_input.setPlaceholderText(placeholder);
  }

  getInfo(){
    return {
      text: this.text_input.toPlainText(),
      visibility: this._parse_visibility(),
      localOnly: this.is_local_check.isChecked(),
      viaMobile: this.is_mobile_check.isChecked()
    }
  }

  _parse_visibility(){
    var result = 'public';

    for(var v of this.visibilitys){
      if(v.text == this.visibility_select.currentText()){
        result = v.name;
      }
    }

    return result;
  }

  clear(){
    this.text_input.setPlainText('');
    if(!App.settings.get("memory_visibility")) this.setVisibility(App.settings.get("start_visibility"));
    this.is_local_check.setChecked(false);
    this.is_mobile_check.setChecked(false);
  }
}

module.exports = PostTextArea;
