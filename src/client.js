const login = require('./login.js');
const request = require("request-promise");
const WebSocketClient = require("websocket").client;
const wss_client = new WebSocketClient();

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

    wss_client.on('connectFailed', (err) => {
        console.log('connect failed: ' + err.toString());
    });

    wss_client.on('connect', (connection) => {
      console.log('connected');
      statusLabel.setText('サーバーに接続しました');

      this.ws = connection;

      connection.on('error', (err) => {
          console.log('error!: ' + err.toString());
          statusLabel.setText('WebSocketエラー');
      });

      connection.on('close', () => {
          statusLabel.setText('サーバーから切断されました。3秒後に再接続を試みます。');
          setTimeout(() => {
            this._connect(statusLabel, count + 1);
          }, 3000);
      });

      connection.on('message', (mes) => {
          timeline.onMess(mes.utf8Data);
      });

      setTimeout(() => {
        this._create_channel_connect(connection, "notification", "main");
        this._create_channel_connect(connection, "home", "homeTimeline");
        this._create_channel_connect(connection, "local", "localTimeline");
        this._create_channel_connect(connection, "social", "hybridTimeline");
        this._create_channel_connect(connection, "global", "globalTimeline");
      }, 300);
    })

    wss_client.connect('wss://' + this.host + '/streaming?i=' + this.api_token);
  }

  _create_channel_connect(con, id, channel){
    var data = {
      type: "connect",
      body: {
        id: id,
        channel: channel
      }
    }

    con.sendUTF(JSON.stringify(data));
  }
}

module.exports = Client;
