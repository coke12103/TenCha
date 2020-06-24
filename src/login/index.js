const crypto = require('crypto');

const Window = require('./window.js');
const Api = require('./api.js');
const message_box = require('../message_box.js');
const file = require('../file.js');

class Login{
  constructor(){}

  async start(){
    try{
      this.load_auth_info();
    }catch{
      await this.first_auth();
      try{
        this.load_auth_info();
      }catch(err){
        console.log(err);
        await this._show_mes_dialog('やばいエラー');
        process.exit(1);
      }
    }
    try{
      var api = new Api(this.host);
      var s = await api.call_api('i', { i: this.api_token });
      this.username = s.username;
    }catch{
      await this._show_mes_dialog('何らかの原因でサーバーからのデータ取得に失敗しました。\n「わかった」を押すと終了します。');
    }
  }

  load_auth_info(){
    this.config_file = file.load('./config.json');

    var config = JSON.parse(this.config_file);

    this.host = config.host;
    this.token = config.token;
    this.secret = config.secret
    var sha256 = crypto.createHash('sha256');
    sha256.update(`${this.token}${this.secret}`);
    this.api_token = sha256.digest('hex');
  }

  first_auth(){
    return new Promise(async (resolve, reject) =>{
        this.current_stage = 0;
        this.isNotDone = true;

        while(this.isNotDone){
          if(this.current_stage == 0){
            try{
              await this._win_exec(0);
              await this._stage0_auth();
              this.current_stage = 1;
            }catch(err){
              console.log(err);
              var mes = "テキストがありません!";
              switch(err){
                case "app_create_err":
                  mes = "アプリの作成に失敗しました!";
                  break;
                case "session_create_err":
                  mes = "セッションの作成に失敗しました!";
                  break;
              }
              await this._show_mes_dialog(mes);
            }
          }else{
            try{
              await this._win_exec(1);
              await this._stage1_auth();
              await file.json_write('./config.json', this.api.auth_data());
              await this._show_mes_dialog("TenChaへようこそ!\nログインに成功しました!\n何か操作するとストリーミング接続されます!");
              this.isNotDone = false;
            }catch(err){
              console.log(err);
              var mes = "なんか失敗しました!";
              if(err == "get_userkey_err") mes = "ユーザーキーの取得に失敗しました!";
              await this._show_mes_dialog(mes);
            }
          }
        }

        resolve(0);
    })
  }

  _show_mes_dialog(mes_str){
    return new Promise((resolve, reject) => {
        var mes = new message_box(mes_str, 'わかった');
        mes.onPush(() =>{
            mes.close();
            resolve(0);
        });
        mes.exec();
    })
  }

  _win_exec(stage){
    return new Promise((resolve, reject) =>{
      this.win = new Window();
      this.win["toStage" + stage]();
      if(stage == 1) this.win.link.setText(this.api.session.url);
      // GUIの闇であるハック
      this.win.setPostButtonEvent(this["_stage" + stage + "_event"].bind(this, () => { resolve(0); }));
      this.win.main_win.exec();
    })
  }

  _stage0_event(next){
    var host = this.win.host_input.text();
    var via = this.win.via_input.text();

    if(!host){
      this.win.status_label.setText('ホストを入力してね');
      return;
    }
    if(!via) via = 'TenCha';

    this.client_info = {
      host: host,
      via: via
    };

    next();
    // 閉じないと動かないので閉じる
    this.win.close();
  }

  _stage1_event(next){
    next();
    this.win.close();
  }

  async _stage0_auth(){
    console.log(this.client_info);
    this.api = new Api(this.client_info.host);

    try{
      await this.api.app_create(this.client_info.via);
    }catch{
      throw "app_create_err";
    }

    try{
      await this.api.session_create();
    }catch{
      throw "session_create_err";
    }

    return;
  }

  async _stage1_auth(){
    try{
      await this.api.get_userkey();
    }catch(err){
      throw "get_userkey_err";
    }

    return;
  }
}

module.exports = Login;
