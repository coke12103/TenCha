const {
  QWidget,
  QLabel,
  QBoxLayout,
  Direction,
  QPushButton,
  TextInteractionFlag
} = require('@nodegui/nodegui');

class LoginUrlWidget extends QWidget{
  constructor(){
    super();

    this.layout = new QBoxLayout(Direction.TopToBottom);

    this.message_label = new QLabel();
    this.status_label = new QLabel();
    this.link_label = new QLabel();
    this.confirm_button = new QPushButton();

    this.setLayout(this.layout);

    this.layout.setContentsMargins(5,5,5,5);
    this.layout.setSpacing(5);

    this.message_label.setWordWrap(true);
    this.message_label.setText('アプリケーションの作成に成功しました!\nURLにアクセスしてアクセス許可をして「やっていく」ボタンを押してください!');
    this.message_label.setObjectName('loginLabel');

    this.status_label.setText('');
    this.status_label.setWordWrap(true);
    this.status_label.setObjectName('statusLabel');

    this.link_label.setWordWrap(true);
    this.link_label.setTextInteractionFlags(TextInteractionFlag.LinksAccessibleByMouse);
    this.link_label.setOpenExternalLinks(true);
    this.link_label.setObjectName('link');

    this.confirm_button.setText('やっていく');
    this.confirm_button.setObjectName('postButton');

    this.layout.addWidget(this.message_label);
    this.layout.addWidget(this.status_label);
    this.layout.addWidget(this.link_label);
    this.layout.addStretch(1);
    this.layout.addWidget(this.confirm_button);
  }
}

module.exports = LoginUrlWidget;
