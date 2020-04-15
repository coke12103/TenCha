const User = require('./users.js');
const post_parser = require('./tools/post_parser/index.js');

class Note{
  constructor(json, user_map, parser){
    return (async () => {
      this.el_type = 'Note';
      this.id = json.id;
      this.createdAt = Date.parse(json.createdAt);
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
      this.uri = json.uri;

      if(json.renote){
        this.renote = await new Note(json.renote, user_map, parser);
      }else{
        this.renote = null;
      }

      if(this.text) this.text = post_parser.escape_html(this.text);
      if(this.cw) this.cw = post_parser.escape_html(this.cw);

      var _user = user_map[json.user.id];
      if(_user){
        this.user = _user;
        await this.user.update(json.user, parser);
      }else{
        this.user = await new User(json.user, parser);
        user_map[json.user.id] = this.user;
      }

      await parser.parse_note(this);

      return this;
    })();
  }
}

module.exports = Note;
