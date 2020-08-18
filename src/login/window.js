const {
  QDialog,
  QLabel,
  FlexLayout,
  QPushButton,
  QWidget,
  QLineEdit
} = require('@nodegui/nodegui');

const Assets = require('../assets.js');

class LoginWindow{
  constructor(){
    var assets = new Assets("LoginWindow");

    var win = new QDialog();
    var winLayout = new FlexLayout();
    win.setLayout(winLayout);
    win.setWindowTitle('新規ログイン');
    win.resize(300, 250);

    var rootView = new QWidget();
    var rootViewLayout = new FlexLayout();
    rootView.setObjectName('rootView');
    rootView.setLayout(rootViewLayout);

    var loginArea = new QWidget();
    var loginAreaLayout = new FlexLayout();
    loginArea.setObjectName('loginArea');
    loginArea.setLayout(loginAreaLayout);

    var loginLabel = new QLabel();
    loginLabel.setWordWrap(true);
    loginLabel.setText('ログインしたいインスタンスのドメインを入れてSendを押してね!\nVia芸をしたいならViaも入れてね!');
    loginLabel.setObjectName('loginLabel');

    var statusLabel = new QLabel();
    statusLabel.setText('');
    statusLabel.setWordWrap(true);
    statusLabel.setObjectName('statusLabel');

    var hostInput = new QLineEdit();
    hostInput.setPlaceholderText('misskey.dev');
    hostInput.setObjectName('hostInput');

    var viaInput = new QLineEdit();
    viaInput.setPlaceholderText('TenCha');
    viaInput.setObjectName('viaInput');

    var postButton = new QPushButton();
    postButton.setText('Send!');
    postButton.setObjectName('postButton');

    var link = new QLineEdit();
    link.setReadOnly(true);
    link.setObjectName('link');

    rootView.setStyleSheet(assets.css);

    this.main_win = win;
    this.main_layout = winLayout;
    this.root = rootView;
    this.root_layout = rootViewLayout;
    this.login_area = loginArea;
    this.login_layout = loginAreaLayout;
    this.login_label = loginLabel;
    this.status_label = statusLabel;
    this.host_input = hostInput;
    this.via_input = viaInput;
    this.post_button = postButton;
    this.link = link;
  }

  toStage0(){
    this.login_layout.addWidget(this.login_label);
    this.login_layout.addWidget(this.status_label);
    this.login_layout.addWidget(this.host_input);
    this.login_layout.addWidget(this.via_input);

    this.root_layout.addWidget(this.login_area);
    this.root_layout.addWidget(this.post_button);

    this.main_layout.addWidget(this.root);
  }

  toStage1(){
    this.login_layout.addWidget(this.login_label);
    this.login_layout.addWidget(this.link);

    this.root_layout.addWidget(this.login_area);
    this.root_layout.addWidget(this.post_button);

    this.main_layout.addWidget(this.root);

    this.login_label.setText('アプリケーションの作成に成功しました!\nURLにアクセスしてアクセス許可をして「やっていく」ボタンを押してください!');
    this.post_button.setText('やっていく');
  }

  setPostButtonEvent(callback){
    this.post_button.addEventListener('clicked', callback);
  }

  close(){
    this.main_win.close();
  }
}

module.exports = LoginWindow;
