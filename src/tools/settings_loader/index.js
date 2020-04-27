const file = require('../../file.js');
const message_box = require('../../message_box.js');

class SettingsLoader{
  constructor(){
  }

  async init(){
    if(!file.exist_check('./settings.json')){
      await this.create_default_settings();
    }

    try{
      var f = file.load('./settings.json');
      f = JSON.parse(f);
    }catch(err){
      console.log(err);
      await this._show_mes_dialog('設定パースエラー');
      process.exit(1);
    }

    this.use_emojis = f.use_emojis ? f.use_emojis : false;
    this.use_desktop_notification = f.use_desktop_notification ? f.use_desktop_notification : false;
  }

  async create_default_settings(){
    var default_settings = {
      use_emojis: false,
      use_desktop_notification: true
    };

    await file.json_write('./settings.json', default_settings);
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
}

module.exports = SettingsLoader;
