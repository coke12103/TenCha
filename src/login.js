const crypto = require('crypto');

const Window = require('./widgets/login_window/index.js');
const file = require('./file.js');
const App = require('./index.js');

class Login{
  constructor(){
    this.is_login_done = false;
  }

  load_info(){
    var result = false;

    try{
      this.config_file = file.load(`${App.data_directory.get('settings')}config.json`);
      var config = JSON.parse(this.config_file);

      if(!config || !(config.host && config.token && config.secret)) throw "要素が満されていません!";

      this.host = config.host;
      this.token = config.token;
      this.secret = config.secret
      var sha256 = crypto.createHash('sha256');
      sha256.update(`${this.token}${this.secret}`);
      this.api_token = sha256.digest('hex');

      result = true;
    }catch(err){
      console.log(err);
    }

    return result;
  }

  start(){
    return new Promise(async (resolve, reject) =>{
        // とりあえず読み込もうとする
        this.is_login_done = this.load_info();

        // 読み込めたなら疎通テストしてエラーだったら投げる
        if(this.is_login_done){
          try{
            var s = await App.client.call('i', { i: this.api_token }, true, this.host);
            this.username = s.username;
          }catch(err){
            throw(err);
          }

          resolve(0);

        // 読み込めないならとりあえず新規ログインとして扱う
        }else{
          const login_window = new Window();

          var done_func = function(){
            var result = login_window.getResult();
            if(result) reject(1);

            this.is_login_done = this.load_info();
            resolve(0);
          };

          login_window.addEventListener('Close', done_func.bind(this));
          login_window.show();
        }
    })
  }
}

module.exports = Login;
