const file = require('../file.js');

class TabLoader{
  constructor(){
  }

  async load(){
    if(!file.exist_check('./tabs.json')){
      await this.create_default_tab();
    }

    try{
      var f = file.load('./tabs.json');
      f = JSON.parse(f);
    }catch{
      throw 'LoadErr';
    }

    return f;
  }

  // TODO: limit
  async create_default_tab(){
    var default_tabs = {
      tabs: [
        {
          "id": "home",
          "name": "ホーム",
          "source": {
            "from": ["home"]
          }
        },
        {
          "id": "local",
          "name": "ローカル",
          "source": {
            "from": ["local"]
          }
        },
        {
          "id": "social",
          "name": "ソーシャル",
          "source": {
            "from": ["social"]
          }
        },
        {
          "id": "global",
          "name": "グローバル",
          "source": {
            "from": ["global"]
          }
        },
        {
          "id": "notification",
          "name": "通知",
          "source": {
            "from": ["notification"]
          }
        }
      ]
    }

    await file.json_write('./tabs.json', default_tabs);
  }
}

module.exports = TabLoader;
