const file = require('../file.js');

class ReplaceBlocker{
  constructor(){
  }

  async init(){
    if(!file.exist_check('./replace_blocks.json')){
      await this.create_default_file();
    }

    try{
      var f = file.load('./replace_blocks.json');
      f = JSON.parse(f);
      this.replace_words = f.replace_words;
    }catch(err){
      console.log(err);
      this.replace_words = [];
    }
  }

  async create_default_file(){
    var default_file = {
      replace_words: []
    };

    await file.json_write('./replace_blocks.json', default_file);
  }

  is_block(note){
    var result = false;
    for(var word of this.replace_words){
      var replace_word = word.from;
      var replace_regexp;
      if(word.regexp){
        if(word.ignore_case){
          replace_regexp = new RegExp(replace_word, 'gi');
        }else{
          replace_regexp = new RegExp(replace_word, 'g');
        }
      }else{
        replace_regexp = new RegExp(this.escape_regexp(replace_word), 'g');
      }

      if(word.screen_name && note.user.screen_name) note.user.name = note.user.screen_name.replace(replace_regexp, word.to);
      if(note.cw) note.cw = note.cw.replace(replace_regexp, word.to);
      if(note.text) note.text = note.text.replace(replace_regexp, word.to);
      if(note.renote && note.renote.cw)  note.renote.cw = note.renote.cw.replace(replace_regexp, word.to);
      if(note.renote && note.renote.text) note.renote.text = note.renote.text.replace(replace_regexp, word.to);
      if(note.reply && note.reply.cw) note.reply.cw = note.reply.cw.replace(replace_regexp, word.to);
      if(note.reply && note.reply.text) note.reply.text = note.reply.text.replace(replace_regexp, word.to);
    }

    return false;
  }

  escape_regexp(str){
    return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
  }
}

module.exports = ReplaceBlocker;
