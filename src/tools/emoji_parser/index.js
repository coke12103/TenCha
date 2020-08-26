const { parse } = require('twemoji-parser');
const { QPixmap } = require('@nodegui/nodegui');

const Cache = require('./cache.js');
const App = require('../../index.js')

class EmojiParser{
  constructor(){
    this.cache = new Cache();
  }

  async parse(text, mk_emojis){
    if(!App.settings.use_emojis) return text;

    var emojis = [];

    var twemojis = parse(text);

    for(var emoji of twemojis) emojis.push(this._get_emoji_regexp(emoji, 'Twemoji'));
    for(var emoji of mk_emojis) emojis.push(this._get_emoji_regexp(emoji, 'MisskeyCustomEmoji'));

    var _emojis = await Promise.all(emojis);

    for(var emoji of _emojis){
      if(!emoji.regexp) continue;

      text = text.replace(emoji.regexp, emoji.img);
    }

    return text;
  }

  // 廃止したい
  async parse_note(note){
    if(!App.settings.use_emojis) return note;

    var e_user = this.parse_user(note.user);
    if(note.text) var e_text = this.parse(note.text, note.emojis);
    if(note.cw) var e_cw = this.parse(note.cw, note.emojis);

    if(note.text) note.text = await e_text;
    if(note.cw) note.cw = await e_cw;

    await e_user;
  }

  async parse_user(user){
    if(!App.settings.use_emojis) return user;

    if(user.name) user.name = await this.parse(user.name, user.emojis);
  }

  async _get_emoji_regexp(emoji_data, type){
    var result = {
      regexp: null,
      img: null
    }

    try{
      var emoji = await this.cache.get(emoji_data);
      var pix = new QPixmap(emoji.filename);

      var width = pix.width();
      var height = pix.height();
      var ratio;

      // 高さのみ制限
      ratio = height / 14;

      width = width / ratio;
      height = 14;

      width = Math.ceil(width);
      height = Math.ceil(height);

      result.img = `<img src="${emoji.filename}" width="${width}" height="${height}">`;

      if(type == 'Twemoji'){
        result.regexp = new RegExp(this.escape_regexp(emoji.match_str), 'g');
      }else if(type == 'MisskeyCustomEmoji'){
        result.regexp = new RegExp(this.escape_regexp(`:${emoji.match_str}:`), 'g');
      }
    }catch(err){
      console.log(err);
    }

    return result;
  }

  escape_regexp(str){
    return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
  }
}

module.exports = EmojiParser;
