const file = require('../file.js');
const App = require('../index.js');

class TabLoader{
  constructor(){
    if(!file.exist_check(`${App.data_directory.get('settings')}tabs.json`)) this.create_default_tab();

    try{
      var f = file.load(`${App.data_directory.get('settings')}tabs.json`);
      f = JSON.parse(f);
    }catch{
      throw 'LoadErr';
    }

    return f;
  }

  // TODO: limit
  create_default_tab(){
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

    file.json_write_sync(`${App.data_directory.get('settings')}tabs.json`, default_tabs);
  }
}

module.exports = TabLoader;
