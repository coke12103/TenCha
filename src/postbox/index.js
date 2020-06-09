const {
  QWidget,
  FlexLayout,
  QPlainTextEdit,
  QPushButton,
  QKeyEvent,
  KeyboardModifier,
  Key,
  QFont,
  QComboBox,
  QCheckBox
} = require('@nodegui/nodegui');

const Assets = require('../assets.js');

class PostBox{
  constructor(){
    const Area = new QWidget();
    const AreaLayout = new FlexLayout();
    Area.setObjectName('postArea');
    Area.setLayout(AreaLayout);

    const SubArea = new QWidget();
    const SubAreaLayout = new FlexLayout();
    SubArea.setObjectName('postSubArea');
    SubArea.setLayout(SubAreaLayout);

    const postTextInput = new QPlainTextEdit();
    postTextInput.setObjectName('postTextInput');
    postTextInput.setReadOnly(false);
    postTextInput.setWordWrapMode(3);

    const postButton = new QPushButton();
    postButton.setText('Post!');
    postButton.setObjectName('postButton');

    const visibilitySelect = new QComboBox();
    visibilitySelect.setObjectName('postVisibilitySelect');

    const isLocalCheck = new QCheckBox();
    isLocalCheck.setObjectName('postIsLocalCheck');
    isLocalCheck.setText('ローカルのみ');

    SubAreaLayout.addWidget(postButton);
    SubAreaLayout.addWidget(visibilitySelect);
    SubAreaLayout.addWidget(isLocalCheck);

    AreaLayout.addWidget(postTextInput);
    AreaLayout.addWidget(SubArea);

    this.assets = new Assets("Postbox");

    this.area = Area;
    this.layout = AreaLayout;
    this.post_text_input = postTextInput;
    this.post_button = postButton;
    this.visibility_select = visibilitySelect;
    this.is_local_check = isLocalCheck;
    this.filters = [];

    this.update_placeholder();
  }

  get_data(){
    var text = this.post_text_input.toPlainText();
    var _visibility = this.visibility_select.currentText();
    var is_local = this.is_local_check.isChecked();
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
    var data = {
      text: text,
      visibility: visibility,
      localOnly: is_local
    }

    return data;
  };
  add_event_listener(callback){
    this.post_button.addEventListener('clicked', () => {
        for(var filter of this.filters){
          filter(this.post_text_input);
        }
        callback();
        this.update_placeholder();
    });
    this.post_text_input.addEventListener('KeyPress', (key) => {
        var _key = new QKeyEvent(key);
        if(_key.modifiers() != KeyboardModifier.ControlModifier) return;
        if(!(
            _key.key() == Key.Key_Enter ||
            _key.key() == Key.Key_Return
        )) return;

        this.post_button.click();
    })
  }
  clear(){
    this.post_text_input.setPlainText('');
    this.post_text_input.update();
  };

  update_placeholder(){
    var _placeholder = this.assets.placeholder;
    var placeholder = _placeholder[Math.floor(Math.random() * _placeholder.length)];
    this.post_text_input.setPlaceholderText(placeholder);
  }

  setup(_font, random_emoji){
    const font = new QFont(_font, 9);

    this.post_text_input.setFont(font);
    this.post_button.setFont(font);
    this.visibility_select.setFont(font);
    this.is_local_check.setFont(font);

    this.emoji_gen = random_emoji;

    this.visibility_select_setup();
  }

  visibility_select_setup(){
    this.visibility_select.addItem(undefined, '公開');
    this.visibility_select.addItem(undefined, 'ホーム');
    this.visibility_select.addItem(undefined, 'フォロワー');
    this.visibility_select.addItem(undefined, 'ダイレクト');
    this.visibility_select.addItem(undefined, 'ランダム');
  }

  add_post_filter(callback){
    this.filters.push(callback);
  }

  filter(callback){
    callback(this.post_text_input);
  }

  random_emoji(){
    var emoji = this.emoji_gen.exec();
    this.post_text_input.insertPlainText(emoji);
  }
}

module.exports = PostBox;
