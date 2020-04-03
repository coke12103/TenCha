const request = require("request-promise");
const file = require('./file.js');
const style = require('./style.js');
const crypto = require('crypto');
const {
  QDialog,
  QLabel,
  FlexLayout,
  QPushButton,
  QPushButtonEvents,
  QWidget,
  QLineEdit,
  QApplication
} = require('@nodegui/nodegui');

var login = {};

function call_api(host, path, data){
  return new Promise((resolve, reject) => {
      var req = {
        url: "https://" + host + "/api/" + path,
        method: "POST",
        json: data
      }

      request(req).then(async (body) => {
          resolve(body)
      }).catch((err) => {
          throw err;
      })
  })
}

// configにtokenがないと呼ばれる
login.new = function(){
  return new Promise(async (resolve, reject) => {
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
    loginAreaLayout.addWidget(loginLabel);

    var statusLabel = new QLabel();
    statusLabel.setText('');
    statusLabel.setWordWrap(true);
    statusLabel.setObjectName('statusLabel');
    loginAreaLayout.addWidget(statusLabel);

    var hostInput = new QLineEdit();
    hostInput.setPlaceholderText('misskey.dev');
    hostInput.setObjectName('hostInput');
    loginAreaLayout.addWidget(hostInput);

    var viaInput = new QLineEdit();
    viaInput.setPlaceholderText('TenCha');
    viaInput.setObjectName('viaInput');
    loginAreaLayout.addWidget(viaInput);

    var postButton = new QPushButton();
    postButton.setText('Send!');
    postButton.setObjectName('postButton');

    rootViewLayout.addWidget(loginArea);
    rootViewLayout.addWidget(postButton);

    style.add_style(rootView, './style/login.css');

    winLayout.addWidget(rootView);
    win.show();

    var isWork = false;

    postButton.addEventListener('clicked', async () => {
      if(isWork) return;
      isWork = true;
      var host = hostInput.text();
      var via = viaInput.text();

      if(!host){
        statusLabel.setText('ホストを入力してね');
        isWork = false;
        return;
      }
      if(!via) via = 'TenCha';

      statusLabel.setText('アプリ作成中...');
      var app = await this.app_create(host, via, statusLabel);
      if(!app){
        isWork = false;
        return;
      }

      statusLabel.setText('セッション作成中...');
      var session = await this.session_create(host, app.secret, statusLabel);
      if(!session){
        isWork = false;
        return;
      }

      statusLabel.setText('');
      loginLabel.setText('アプリケーションの作成に成功しました!\nURLにアクセスしてアクセス許可をして「やっていく」ボタンを押してください!');
      loginAreaLayout.removeWidget(hostInput);
      loginAreaLayout.removeWidget(viaInput);
      rootViewLayout.removeWidget(postButton);
      hostInput.close();
      viaInput.close();
      postButton.close();

      var link = new QLineEdit();
      link.setText(session.url);
      link.setReadOnly(true);
      link.setObjectName('link');
      loginAreaLayout.addWidget(link);


      var _postButton = new QPushButton();
      _postButton.setText('やっていく');
      _postButton.setObjectName('_postButton');

      rootViewLayout.addWidget(_postButton);

      isWork = false;

      _postButton.addEventListener('clicked', async () => {
          console.log(isWork)
          if(isWork) return;
          isWork = true;
          statusLabel.setText('ユーザーキー取得中...');
          var userkey = await this.get_userkey(host, app.secret, session.token, statusLabel);
          if(!userkey){
            return;
            isWork = false;
          }

          var data = {
            host: host,
            secret: app.secret,
            token: userkey.accessToken
          };

          try{
            statusLabel.setText('書き込み中...');
            await file.json_write('./config.json', data);
          }catch(err){
            console.log(err);
            console.log('致命的なエラー');
            reject(false);
          }

          win.close();
          resolve(true);
      })
    });
  });
};

login.app_create = function(host, via, statusLabel){
  return new Promise(async (resolve, reject) => {
    var app = false;
    var data = {
      name: via,
      description: 'ネイティブなウインドウでMisskeyをしたいんだ...',
      permission: ['read:account', 'write:account', 'read:blocks', 'write:blocks', 'read:drive', 'write:drive', 'read:favorites', 'write:favorites', 'read:following', 'write:following', 'read:messaging', 'write:messaging', 'read:mutes', 'write:mutes', 'write:notes', 'read:notifications', 'write:notifications', 'read:reactions', 'write:reactions', 'write:votes', 'read:pages', 'write:pages', 'write:page-likes', 'read:page-likes', 'read:user-groups', 'write:user-groups']
    };

    try{
      app = await call_api(host, 'app/create', data);
      console.log(app);
    }catch(err){
      console.log(err);
      statusLabel.setText('アプリケーションの作成に失敗しました!: ' + err.error.message);
      app = false;
    }

    resolve(app);
  });
}

login.session_create = function(host, secret, statusLabel){
  return new Promise(async (resolve, reject) => {
    var res = false;
    var data = {
      appSecret: secret
    };

    try{
      res = await call_api(host, 'auth/session/generate', data);
      console.log(res);
    }catch(err){
      console.log(err);
      statusLabel.setText('セッションの生成に失敗しました!: ' + err.error.message);
      res = false;
    }

    resolve(res);
  });
}

login.get_userkey = function(host, secret, session_token, statusLabel){
  return new Promise(async (resolve, reject) => {
    var res = false;
    var data = {
      appSecret: secret,
      token: session_token
    }

    try{
      res = await call_api(host, 'auth/session/userkey', data);
      console.log(res);
    }catch(err){
      console.log(err);
      statusLabel.setText('トークンの取得に失敗しました!: ' + err.error.message);

      res = false;
    }

    resolve(res);
  });
}

login.check = function(){
  var result = false;

  try{
    this.get_info();
    call_api(this.host, 'i', { i: this.api_token });
    result = true;
  }catch(err){
    result = false;
    console.log(err);
  }

  return result;
}

login.get_info = function(){
  var config_file = file.load('./config.json');
  var result = false;

  try{
    var config = JSON.parse(config_file);

    this.host = config.host;
    this.token = config.token;
    this.secret = config.secret
    var sha256 = crypto.createHash('sha256');
    sha256.update(`${this.token}${this.secret}`);
    this.api_token = sha256.digest('hex');

    result = true;
  }catch{
    result = false;
    throw new Error('ファイルがない');
  }

  return result;
}

module.exports = login;
