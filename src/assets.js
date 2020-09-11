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
      case "TimelineWidget":
        this.css = require('!!raw-loader!../assets/css/timeline.css').default;
        break;
      case "RandomEmoji":
        this.emojis = require('../assets/emojis.json').emojis;
        break;
      case "SettingsLoader":
        this.settings_template = require('../assets/settings.json').settings;
        break;
      case "CustomPostWindow":
        this.placeholder = require('../assets/placeholder.json').placeholder;
        break;
      case "UserAgent":
        this.fake = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36";
        break;
      case "Icons":
        this.clip = require('../assets/icons/clip.png').default;
        this.direct = require('../assets/icons/direct.png').default;
        this.home = require('../assets/icons/home.png').default;
        this.lock = require('../assets/icons/lock.png').default;
        this._public = require('../assets/icons/public.png').default;
        this.renote = require('../assets/icons/renote.png').default;
        break;
      case "EmojiList":
        this.emoji_list = require('../assets/emojilist.json');
        break;
      case "FileList":
        this.files = require('../assets/file_list.json').files;
        break;
    }

    return;
  }
}

module.exports = Asset;
