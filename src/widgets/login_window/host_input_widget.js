const {
  QWidget,
  QLabel,
  QBoxLayout,
  Direction,
  QPushButton,
  QLineEdit
} = require('@nodegui/nodegui');

class HostInputWidget extends QWidget{
  constructor(){
    super();

    this.layout = new QBoxLayout(Direction.TopToBottom);

    this.message_label = new QLabel();
    this.status_label = new QLabel();
    this.host_input = new QLineEdit();
    this.via_input = new QLineEdit();
    this.confirm_button = new QPushButton();

    this.setLayout(this.layout);

    this.layout.setContentsMargins(5,5,5,5);
    this.layout.setSpacing(5);

    this.message_label.setWordWrap(true);
    this.message_label.setText('ログインしたいインスタンスのドメインを入れてSendを押してね!\nVia芸をしたいならViaも入れてね!');
    this.message_label.setObjectName('loginLabel');

    this.status_label.setText('');
    this.status_label.setWordWrap(true);
    this.status_label.setObjectName('statusLabel');

    this.host_input.setPlaceholderText('misskey.dev');
    this.host_input.setObjectName('hostInput')

    this.via_input.setPlaceholderText('TenCha');
    this.via_input.setObjectName('viaInput');

    this.confirm_button.setText('Send!');
    this.confirm_button.setObjectName('postButton');

    this.layout.addWidget(this.message_label);
    this.layout.addWidget(this.status_label);
    this.layout.addWidget(this.host_input);
    this.layout.addWidget(this.via_input);
    this.layout.addStretch(1);
    this.layout.addWidget(this.confirm_button);
  }

  getInfo(){
    var data = {
      host: this.host_input.text(),
      via: this.via_input.text()
    }

    return data;
  }
}

module.exports = HostInputWidget;
