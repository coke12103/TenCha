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

  async parse(text){
    var emojis = parse(text);

    for(var emoji of emojis){
      try{
        var e = await this.cache.get(emoji);
        var img = '<img src="' + e.filename + '" width="14" height="14">';
        var regexp = new RegExp(this.escape_regexp(e.match_str), 'g');
        text = text.replace(regexp, img);
      }catch(err){
        console.log('err: ' + err);
      }
    }

    return text;
  }

  async parse_misskey_emoji(text, emojis){
    for(var emoji of emojis){
      try{
        var e = await this.cache.get(emoji);
        var img = '<img src="' + e.filename + '" width="14" height="14">';
        var regexp = new RegExp(this.escape_regexp(":" + e.match_str + ":"), 'g');
        text = text.replace(regexp, img);
      }catch(err){
        console.log('err: ' + err);
      }
    }

    return text;
  }

  async parse_note(note){
    note.text = await this.parse(note.text);
    note.text = await this.parse_misskey_emoji(note.text, note.emojis);
    if(note.cw){
      note.cw = await this.parse(note.cw);
      note.cw = await this.parse_misskey_emoji(note.cw, note.emojis);
    }
    if(note.renote){
      note.renote.text = await this.parse(note.renote.text);
      note.renote.text = await this.parse_misskey_emoji(note.renote.text, note.renote.emojis);
      if(note.renote.cw){
        note.renote.cw = await this.parse(note.renote.cw);
        note.renote.cw = await this.parse_misskey_emoji(note.renote.cw, note.renote.emojis);
      }
    }
  }

  async parse_user(user){
    if(user.name){
      user.name = await this.parse(user.name);
      user.name = await this.parse_misskey_emoji(user.name, user.emojis);
    }
  }

  escape_regexp(str){
    return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
  }
}

module.exports = EmojiParser;
