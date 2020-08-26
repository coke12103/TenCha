const User = require('./users.js');
const post_parser = require('./tools/post_parser/index.js');
const App = require('./index.js');

class Note{
  constructor(json, posts, user_map, parser){
    return (async () => {
      this.el_type = 'Note';
      this.id = json.id;
      this.createdAt = Date.parse(json.createdAt);
      this.app = json.app;
      this.text = json.text;
      this.cw = json.cw;
      this.no_emoji_text = json.text;
      this.no_emoji_cw = json.cw;
//      this.display_text = json.text;
//      this.display_cw = json.cw;
      this.userId = json.userId;
      this.replyId = json.replyId;
      this.renoteId = json.renoteId;
      this.viaMobile = json.viaMobile;
      this.isHidden = json.isHidden;
      this.visibility = json.visibility;
      // this.mentions = if あとで
      this.visibleUserIds = json.visibleUserIds;
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
        var _renote = posts[json.renote.id];
        if(_renote){
          this.renote = _renote;
        }else{
          this.renote = await new Note(json.renote, posts, user_map, parser);
          posts[json.renote.id] = this.renote;
        }
      }else{
        this.renote = null;
      }

      if(json.reply){
        var _reply = posts[json.reply.id];
        if(_reply){
          this.reply = _reply;
        }else{
          this.reply = await new Note(json.reply, posts, user_map, parser);
          posts[json.reply.id] = this.reply;
        }
      }else{
        this.reply = null;
      }

      if(this.text) this.text = post_parser.escape_html(this.text);
      if(this.cw) this.cw = post_parser.escape_html(this.cw);

//      if(this.text){
//        this.display_text = post_parser.escape_html(this.display_text);
//        this.display_text = await App.emoji_parser.parse(this.display_text, this.emojis);
//      }
//      if(this.cw){
//        this.display_cw = post_parser.escape_html(this.cw);
//        this.display_cw = await App.emoji_parser.parse(this.display_text, this.emojis);
//      }

      var _user = user_map[json.user.id];
      if(_user){
        this.user = _user;
        await this.user.update(json.user, parser);
      }else{
        this.user = await new User(json.user, parser);
        user_map[json.user.id] = this.user;
      }

      // 将来切りたい
      await parser.parse_note(this);

      return this;
    })();
  }
}

module.exports = Note;
