class Asset{
  constructor(asset_type){
    switch(asset_type){
      case "PostView":
        this.no_image = require('../assets/no_image.png').default;
        break;
      case "MainWindow":
        this.css = require('!!raw-loader!../assets/css/index.css').default;
        break;
      case "LoginWindow":
        this.css = require('!!raw-loader!../assets/css/login.css').default;
        break;
      case "Postbox":
        this.placeholder = require('../assets/placeholder.json').placeholder;
        break;
    }

    return;
  }
}

module.exports = Asset;
