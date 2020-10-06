class Asset{
  constructor(asset_type){
    switch(asset_type){
      case "PostView":
        this.no_image = require('../assets/no_image.png').default;
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
        this.reply = require('../assets/icons/reply.png').default;
        this.quote = require('../assets/icons/quote.png').default;
        this.reaction = require('../assets/icons/reaction.png').default;
        this.local_public = require('../assets/icons/local_public.png').default;
        this.local_home = require('../assets/icons/local_home.png').default;
        this.local_lock = require('../assets/icons/local_lock.png').default;
        this.local_direct = require('../assets/icons/local_direct.png').default;
        this.follow = require('../assets/icons/follow.png').default;
        this.follow_request = require('../assets/icons/follow_request.png').default;
        this.follow_accept = require('../assets/icons/follow_accept.png').default;
        this.poll = require('../assets/icons/poll.png').default;
        break;
      case "EmojiList":
        this.emoji_list = require('../assets/emojilist.json');
        break;
      case "FileList":
        this.files = require('../assets/file_list.json').files;
        break;
      case "VersionData":
        this.version_data = require('../assets/version_data.json').version_data;
        break;
    }

    return;
  }
}

module.exports = Asset;
