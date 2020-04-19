const { parse } = require('twemoji-parser');

const Cache = require('./cache.js');

class EmojiParser{
  constructor(){
  }

  async init(){
    const cache = await new Cache();

    this.cache = cache;

    return this;
  }

  async parse(text, mk_emojis){
    var emojis = parse(text);

    var emoji_regs = [];

    for(var emoji of emojis){
      emoji_regs.push(this._get_emojis_regexp(emoji, 'Twemoji'));
    }
    for(var emoji of mk_emojis){
      emoji_regs.push(this._get_emojis_regexp(emoji, 'MisskeyCustomEmoji'));
    }

    try{
      var _emoji_regs = await Promise.all(emoji_regs);

      for(var emoji of _emoji_regs){
        if(!emoji) continue;
        text = text.replace(emoji.regexp, emoji.img);
      }
    }catch(err){
      console.log(err);
    }

    return text;
  }

  async parse_note(note){
    var e_user = this.parse_user(note.user);
    var e_text = this.parse(note.text, note.emojis);
    if(note.cw){
      var e_cw = this.parse(note.cw, note.emojis);
    }
    if(note.renote){
      var e_renote_text = this.parse(note.renote.text, note.renote.emojis);
      if(note.renote.cw){
        var e_renote_cw = this.parse(note.renote.cw, note.renote.emojis);
      }
    }

    note.text = await e_text;
    await e_user;
    if(note.cw) note.cw = await e_cw;
    if(note.renote){
      note.renote.text = await e_renote_text;
      if(note.renote.cw) note.renote.cw = await e_renote_cw;
    }
  }

  async parse_user(user){
    if(user.name) user.name = await this.parse(user.name, user.emojis);
  }

  async _get_emojis_regexp(emoji, type){
    try{
      var e = await this.cache.get(emoji);
      var img = '<img src="' + e.filename + '" width="14" height="14">';
      var regexp;
      if(type == 'Twemoji'){
        regexp = new RegExp(this.escape_regexp(e.match_str), 'g');
      }else if(type == 'MisskeyCustomEmoji'){
        regexp = new RegExp(this.escape_regexp(":" + e.match_str + ":"), 'g');
      }
    }catch(err){
      console.log(err);
      return null;
    }

    return {regexp: regexp, img: img};
  }

  escape_regexp(str){
    return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
  }
}

module.exports = EmojiParser;
