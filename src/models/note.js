const post_parser = require('../tools/post_parser/index.js');
const App = require('../index.js');

class Note{
  constructor(json){
    return (async () => {
      this.el_type = 'Note';
      this.use_tl = {};

      // 変わらない内容
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
      this.localOnly = json.localOnly;
      this.isHidden = json.isHidden;
      this.visibility = json.visibility;
      // this.mentions = if あとで
      this.visibleUserIds = json.visibleUserIds;
      this.fileIds = json.fileIds;
      this.files = json.files;
      this.tags = json.tags;
      this.poll = json.poll;
      this.geo = json.geo;
      this.uri = json.uri;

      // 変わる内容
      this.renoteCount = json.renoteCount;
      this.repliesCount = json.repliesCount;
      this.reactions = json.reactions;
      this.emojis = json.emojis;

      if(json.renote){
        this.renote = await App.note_cache.get(json.renote);
        App.note_cache.use(this.renote.id, this.id);
      }else{
        this.renote = null;
      }

      if(json.reply){
        this.reply = await App.note_cache.get(json.reply);
        App.note_cache.use(this.reply.id, this.id);
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

      this.user = await App.user_cache.use(json.user);

      this.is_renote = (
        this.renote
        && !this.text
        && !this.cw
        && (!this.poll || (this.poll && !this.poll.choices))
        && !this.files[0]
      );

      this.is_quote = (!this.is_renote && this.renote);

      // 将来切りたい
      await App.emoji_parser.parse_note(this);

      return this;
    })();
  }

  update(){

  }

  purge(){
    if(this.reply) App.note_cache.free(this.reply.id, this.id);
    if(this.renote) App.note_cache.free(this.renote.id, this.id);
  }
}

module.exports = Note;
