const login = require('./login.js');
const request = require("request-promise");
const WebSocketClient = require("ws");

class Client{
  constructor(){
    this.ws;
  }
  async login(){
    if(await !login.check()){
      console.log('create new app');
      await login.new().then(async () => {
        await login.check();
        this.host = login.host;
        this.token = login.token;
        this.secret = login.secret;
        this.api_token = login.api_token;
      }).catch((err) => {
        console.log(err);
        process.exit(1);
      })
    }else{
      console.log('login!');
      this.host = login.host;
      this.token = login.token;
      this.secret = login.secret;
      this.api_token = login.api_token;
    }
  }
  async call(path, data){
    return new Promise((resolve, reject) => {
        var req = {
          url: "https://" + this.host + "/api/" + path,
          method: "POST",
          json: data
        }
        data.i = this.api_token;

        request(req).then(async (body) => {
            resolve(body)
        }).catch((err) => {
            reject(err);
        })
    })
  }

  connect_ws(statusLabel, timeline){
    return new Promise((resolve, reject) => {
      this._connect(statusLabel, 0, timeline);
      resolve(0);
    })
  }

  _connect(statusLabel, count, timeline){
    if(count > 30){
      statusLabel.setText('合計再接続回数が30回を越えたため諦めました。');
      this.ws = null;
      return;
    }

    var url = 'wss://' + this.host + '/streaming?i=' + this.api_token;

    if(this.ws_connected) return;

    console.log('start connect');
    const connection = new WebSocketClient(url);

    connection.on('open', () => {
      console.log('connected');

      statusLabel.setText('サーバーに接続しました');

      this.ws = connection;
      this.ws_connected = true;

      setTimeout(() => {
        this._create_channel_connect(connection, "notification", "main");
        this._create_channel_connect(connection, "home", "homeTimeline");
        this._create_channel_connect(connection, "local", "localTimeline");
        this._create_channel_connect(connection, "social", "hybridTimeline");
        this._create_channel_connect(connection, "global", "globalTimeline");
      }, 300);
    });

    connection.on('error', (err) => {
      console.log('error!: ' + err);
      statusLabel.setText('WebSocketエラー');
    });

    connection.on('close', () => {
        console.log('closed!');
        statusLabel.setText('サーバーから切断されました。3秒後に再接続を試みます。');
        setTimeout(() => {
            this.ws_connected = false;
            this.ws = null;
            this._connect(statusLabel, count + 1, timeline);
        }, 3000);
    });

    connection.on('message', (data) => {
        timeline.onMess(data);
    });
  }

  _create_channel_connect(con, id, channel){
    var data = {
      type: "connect",
      body: {
        id: id,
        channel: channel
      }
    }

    con.send(JSON.stringify(data));
  }
}

module.exports = Client;
