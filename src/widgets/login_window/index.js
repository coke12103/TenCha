const {
  QWidget,
  QBoxLayout,
  Direction,
  WindowType,
  QStackedWidget
} = require('@nodegui/nodegui');

const HostInputWidget = require('./host_input_widget.js');
const LoginUrlWidget = require('./login_url_widget.js');
const App = require('../../index.js');
const file = require('../../file.js');

class LoginWindow extends QWidget{
  constructor(){
    super();

    this.data = {};

    this.layout = new QBoxLayout(Direction.TopToBottom);

    this.root = new QStackedWidget();

    this.host_input_widget = new HostInputWidget();
    this.login_url_widget = new LoginUrlWidget();

    this.setLayout(this.layout);
    this.setWindowFlag(WindowType.Window, true);
    this.setWindowTitle('新規ログイン - TenCha');
    this.resize(300, 150);
    this.setObjectName('rootView');

    this.layout.setContentsMargins(0,0,0,0);
    this.layout.setSpacing(0);

    this.root.addWidget(this.host_input_widget);
    this.root.addWidget(this.login_url_widget);

    this.layout.addWidget(this.root);

    this.host_input_widget.confirm_button.addEventListener('clicked', this._get_app_and_session.bind(this));
    this.login_url_widget.confirm_button.addEventListener('clicked', this._get_userkey.bind(this));

    this.root.setCurrentWidget(this.host_input_widget);
  }

  async _get_app_and_session(){
    var info = this.host_input_widget.getInfo();

    if(!info.host){
      this.host_input_widget.status_label.setText('ホストを入力してね');
      return;
    }

    if(!info.via) info.via = 'TenCha';

    var data = {
      name: info.via,
      description: 'ネイティブなウインドウでMisskeyをしたいんだ...',
      permission: ['read:account', 'write:account', 'read:blocks', 'write:blocks', 'read:drive', 'write:drive', 'read:favorites', 'write:favorites', 'read:following', 'write:following', 'read:messaging', 'write:messaging', 'read:mutes', 'write:mutes', 'write:notes', 'read:notifications', 'write:notifications', 'read:reactions', 'write:reactions', 'write:votes', 'read:pages', 'write:pages', 'write:page-likes', 'read:page-likes', 'read:user-groups', 'write:user-groups']
    };

    this.data.host = info.host;
    this.data.via = info.via;

    this.host_input_widget.status_label.setText('アプリの作成中...');

    try{
      var app = await App.client.call('app/create', data, true, info.host);
      this.data.app = app;
      console.log(app);
    }catch(err){
      console.log(err);
      this.host_input_widget.status_label.setText('アプリ作成に失敗しました!');
      return;
    }

    this.host_input_widget.status_label.setText('セッションの作成中...');
    var session_data = { appSecret: this.data.app.secret };

    try{
      var session = await App.client.call('auth/session/generate', session_data, true, info.host);
      this.data.session = session;
      console.log(session);
    }catch(err){
      console.log(err);
      this.host_input_widget.status_label.setText('セッション作成に失敗しました!');
      return;
    }

    this.login_url_widget.link_label.setText(`<html><a href="${this.data.session.url}">${this.data.session.url}</a>`);
    this.root.setCurrentWidget(this.login_url_widget);
  }

  async _get_userkey(){
    this.login_url_widget.status_label.setText('ユーザーキーの取得中...');

    var data = {
      appSecret: this.data.app.secret,
      token: this.data.session.token
    }

    try{
      var userkey = await App.client.call('auth/session/userkey', data, true, this.data.host);
      this.data.userkey = userkey;
      console.log(userkey);
    }catch(err){
      console.log(err);
      this.login_url_widget.status_label.setText('ユーザーキーの取得に失敗しました!');
      return;
    }

    this.login_url_widget.status_label.setText('認証情報の書き出し中...');
    var auth_info = {
      host: this.data.host,
      secret: this.data.app.secret,
      token: this.data.userkey.accessToken
    }

    try{
      await file.json_write(`${App.data_directory.get('settings')}config.json`, auth_info);
    }catch(err){
      console.log(err);
      this.login_url_widget.status_label.setText('認証情報の書き出しに失敗しました!');
      return;
    }

    this.data.done = true;

    this.close();
  }

  getResult(){
    var result = false;

    if(!this.data.done) result = true;

    return result;
  }
}

module.exports = LoginWindow;
