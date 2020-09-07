const file = require('../../file.js');
const Assets = require('../../assets.js');
const message_box = require('../../message_box.js');

class Settings{
  constructor(){
    this.assets = new Assets('SettingsLoader');
    this.values = {};

    if(!file.exist_check('./settings.json')) this.create_default_settings();
  }

  create_default_settings(){
    var default_settings = {};

    for(var setting of this.assets.settings_template){
      default_settings[setting.id] = setting.default_value;
    }

    file.json_write_sync('./settings.json', default_settings);
  }

  async init(){
    try{
      this.load_settings();
    }catch(err){
      console.log(err);
      await this._show_mes_dialog('設定パースエラー');
      process.exit(1);
    }
  }

  load_settings(){
    var f = file.load('./settings.json');
    f = JSON.parse(f);

    for(var setting of this.assets.settings_template){
      this.values[setting.id] = setting.id in f ? f[setting.id] : setting.default_value;
    }
  }

  get(id){
    return this.values[id];
  }

  set(id, val){
    this.values[id] = val;
    try{
      this.sync();
    }catch{
      throw err;
    }
  }

  get_settings_list(){
    var list = [];

    for(var setting of this.assets.settings_template){
      var s = Object.assign({}, setting);
      s.value = s.default_value;

      if(setting.id in this.values) s.value = this.values[s.id];

      list.push(s);
    }

    return list;
  }

  sync(){
    file.json_write_sync('./settings.json', this.values);
    try{
      this.load_settings();
    }catch(err){
      throw err;
    }
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

module.exports = Settings;
