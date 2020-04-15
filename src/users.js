const request = require("request-promise");
const { QPixmap } = require('@nodegui/nodegui');
const no_image_image = require('../assets/no_image.png');
const post_parser = require('./tools/post_parser/index.js');

class User{
  constructor(json, parser){
    return (async () => {
      this.id = json.id;
      this.username = json.username;
      this.name = json.name;
      this.description = json.description;
      this.host = json.host;
      if(this.host){
        this.acct = this.username + "@" + this.host;
      }else{
        this.acct = this.username;
      }
      this.avatarUrl = json.avatarUrl;
      // これ使うタイミングあるの？
      this.avatarColor = json.avatarColor;
      this.isCat = json.isCat;
      this.isAdmin = json.isAdmin;
      this.isBot = json.isBot;
      this.url = json.url;
      this.createdAt = json.createdAt;
      this.updatedAt = json.updatedAt;
      this.bannerUrl = json.bannerUrl;
      this.bannerColor = json.bannerColor;
      this.isLocked = json.isLocked;
      this.isModerator = json.isModerator;
      this.isSilenced = json.isSilenced;
      this.isSuspeded = json.isSuspeded;
      this.userDescription = json.userDescription;
      this.location = json.location;
      this.birthday = json.birthday;
      //this.fields = json.fields;
      this.followersCount = json.followersCount;
      this.followingCount = json.followingCount;
      this.notesCount = json.notesCount;
      //this.pinnedNoteIds = json.pinnedNoteIds;
      //this.pinnedNotes = json.pinnedNoteIds;
      //this.pinnedPageId = json.pinnedPageId;
      //this.pinnedPage = json.pinnedPage;
      //this.twoFactorEnabled = json.twoFactorEnabled;
      //this.usePasswordLessLogin = json.usePasswordLessLogin;
      //this.securityKeys = json.securityKeys;
      this.twitter = json.twitter;
      this.github = json.github;
      this.discord = json.discord;
      //this.hasUnreadSpecifiedNotes = json.hasUnreadSpecifiedNotes;
      //this.hasUnreadMentions = json.hasUnreadMentions;
      this.avatarId = json.avatarId;
      this.bannerId = json.bannerId;
      this.emojis = json.emojis;

      if(this.name) this.name = post_parser.escape_html(this.name);

      await this.load_avater().then((avater) => {
          this.avater = avater;
      }).catch((err) => {
          console.log('add avater failed')
          console.log(err);
          this.avater = null;
      })

      await parser.parse_user(this);

      return this;
    })();
  }

  async update(json, parser){
    if(this.name && (this.name != json.name)) this.name = json.name;
    if(this.avatarUrl && (this.avatarUrl != json.avatarUrl)){
      this.avatarUrl = json.avatarUrl;
      await this.load_avater().then((avater) => {
          this.avater = avater;
      }).catch((err) => {
          console.log('add avater failed')
          console.log(err);
      })
    }
    if(this.name) this.name = post_parser.escape_html(this.name);
    await parser.parse_user(this);
  }

  load_avater(){
    return new Promise((resolve, reject) => {
        var opt = {
          url: this.avatarUrl,
          encoding: null,
          method: 'GET',
          resolveWithFullResponse: true
        };

        var pix = new QPixmap();

        request(opt).then((res) => {
          var ext = res.headers['content-type'].match(/\/([a-z]+)$/)[1].toUpperCase();

          try{
            pix.loadFromData(res.body, ext);
            console.log('set done');
          }catch(err){
            try{
              pix.load(no_image_image.default);
            }catch(err){
              throw err;
            }
          }
          resolve(pix);
      }).catch((err) => {
          try{
            pix.load(no_image_image.default);
            resolve(pix);
          }catch(err){
            console.log(err);
            reject(1);
          }
          reject(1);
      })
    })
  }
}

module.exports = User;
