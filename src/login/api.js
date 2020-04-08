const request = require("request-promise");

class API{
  constructor(host){
    this.host = host;
  }

  async call_api(path, data){
    var req = {
      url: "https://" + this.host + "/api/" + path,
      method: "POST",
      json: data
    }

    try{
      var body = await request(req);
    }catch(err){
      throw err;
    }

    return body;
  }

  async app_create(via){
    var data = {
      name: via,
      description: 'ネイティブなウインドウでMisskeyをしたいんだ...',
      permission: ['read:account', 'write:account', 'read:blocks', 'write:blocks', 'read:drive', 'write:drive', 'read:favorites', 'write:favorites', 'read:following', 'write:following', 'read:messaging', 'write:messaging', 'read:mutes', 'write:mutes', 'write:notes', 'read:notifications', 'write:notifications', 'read:reactions', 'write:reactions', 'write:votes', 'read:pages', 'write:pages', 'write:page-likes', 'read:page-likes', 'read:user-groups', 'write:user-groups']
    };

    try{
      var app = await this.call_api('app/create', data);
      this.app = app;
      console.log(app);
    }catch(err){
      console.log(err);
      throw err;
    }

    return;
  }

  async session_create(){
    var data = {
      appSecret: this.app.secret
    };

    try{
      var res = await this.call_api('auth/session/generate', data);
      this.session = res;
      console.log(res);
    }catch(err){
      console.log(err);
      throw err;
    }

    return;
  }

  async get_userkey(){
    var data = {
      appSecret: this.app.secret,
      token: this.session.token
    }

    try{
      var res = await this.call_api('auth/session/userkey', data);
      this.userkey = res;
      console.log(res);
    }catch(err){
      console.log(err);
      throw err;
    }

    return;
  }

  auth_data(){
    var data = {
      host: this.host,
      secret: this.app.secret,
      token: this.userkey.accessToken
    };

    return data;
  }
}

module.exports = API;
