const file = require('../../file.js');
const Assets = require('../../assets.js');
const MessageBox = require('../../message_box.js');
const App = require('../../index.js');

class Settings{
  constructor(){
    this.assets = new Assets('SettingsLoader');
    this.values = {};

    if(!file.exist_check(`${App.data_directory.get('settings')}settings.json`)) this.create_default_settings();
  }

  create_default_settings(){
    var default_settings = {};

    for(var setting of this.assets.settings_template){
      default_settings[setting.id] = setting.default_value;
    }

    file.json_write_sync(`${App.data_directory.get('settings')}settings.json`, default_settings);
  }

  init(){
    try{
      this.load_settings();
    }catch(err){
      console.log(err);
      var mes = new MessageBox('設定パースエラー', 'わかった');
      mes.exec();
      process.exit(1);
    }
  }

  load_settings(){
    try{
      var f = file.load(`${App.data_directory.get('settings')}settings.json`);
      f = JSON.parse(f);

      for(var setting of this.assets.settings_template){
        this.values[setting.id] = setting.id in f ? f[setting.id] : setting.default_value;
      }
    }catch(err){
      throw err;
    }
  }

  get(id){
    return this.values[id];
  }

  set(id, val){
    this.values[id] = val;
    try{
      this.sync();
    }catch(err){
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
    file.json_write_sync(`${App.data_directory.get('settings')}settings.json`, this.values);
    try{
      this.load_settings();
    }catch(err){
      throw err;
    }
  }
}

module.exports = Settings;
