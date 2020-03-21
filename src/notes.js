const User = require('./users.js');

class Note{
  constructor(json, user_map){
    return (async () => {
      this.id = json.id;
      this.createdAt = json.createdAt;
      this.app = json.app;
      this.text = json.text;
      this.cw = json.cw;
      this.userId = json.userId;
      this.replyId = json.replyId;
      this.renoteId = json.renoteId;
      // this.reply = if あとで
      this.viaMobile = json.viaMobile;
      this.isHidden = json.isHidden;
      this.visibility = json.visibility;
      // this.mentions = if あとで
      // this.visibleUserIds = if あとで
      this.fileIds = json.fileIds;
      this.files = json.files;
      this.renoteCount = json.renoteCount;
      this.repliesCount = json.repliesCount;
      this.reactions = json.reactions;
      this.emojis = json.emojis;
      this.tags = json.tags;
      this.poll = json.poll;
      this.geo = json.geo;

      if(json.renote){
        this.renote = await new Note(json.renote, user_map);
      }else{
        this.renote = null;
      }

      var _user = user_map[json.user.id];
      if(_user){
        this.user = _user;
      }else{
        this.user = await new User(json.user);
        user_map[json.user.id] = this.user;
      }



      return this;
    })();
  }
}

module.exports = Note;
