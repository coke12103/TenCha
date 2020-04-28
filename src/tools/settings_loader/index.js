const file = require('../../file.js');
const Assets = require('../../assets.js');
const message_box = require('../../message_box.js');

class SettingsLoader{
  constructor(){
    this.assets = new Assets('SettingsLoader');
  }

  async init(){
    if(!file.exist_check('./settings.json')){
      await this.create_default_settings();
    }

    try{
      var f = file.load('./settings.json');
      f = JSON.parse(f);
      this.load_settings(f);
    }catch(err){
      console.log(err);
      await this._show_mes_dialog('設定パースエラー');
      process.exit(1);
    }
  }

  load_settings(file){
    for(var setting of this.assets.settings_template){
      this[setting.id] = file[setting.id] ? file[setting.id] : setting.default_value;
    }
  }

  async create_default_settings(){
    var default_settings = {};
    for(var setting of this.assets.settings_template){
      default_settings[setting.id] = setting.default_value;
    }

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
