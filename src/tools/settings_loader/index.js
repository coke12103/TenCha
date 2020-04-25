const file = require('../../file.js');

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
    }catch{
      throw 'LoadErr';
    }

    this.use_emojis = f.use_emojis;
  }

  async create_default_settings(){
    var default_settings = {
      use_emojis: false
    };

    await file.json_write('./settings.json', default_settings);
  }
}

module.exports = SettingsLoader;
