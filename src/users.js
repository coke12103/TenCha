const request = require("request-promise");
const { QPixmap } = require('@nodegui/nodegui');

class User{
  constructor(json){
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
      //this.emojis = json.emojis;

      await this.load_avater().then((avater) => {
          this.avater = avater;
      }).catch((err) => {
          console.log('add avater failed')
          console.log(err);
          this.avater = null;
      })

      return this;
    })();
  }

  load_avater(){
    return new Promise((resolve, reject) => {
        var opt = {
          url: this.avatarUrl,
          encoding: null,
          method: 'GET',
          resolveWithFullResponse: true
        };
        request(opt).then((res) => {
          var pix = new QPixmap();
          var ext = res.headers['content-type'].match(/\/([a-z]+)$/)[1].toUpperCase();

          try{
            pix.loadFromData(res.body, ext);
            console.log('set done');
          }catch(err){
            console.log(err);
            reject(1);
          }
          resolve(pix);
      }).catch((err) => {
          console.log(err);
          reject(1);
      })
    })
  }
}

module.exports = User;
