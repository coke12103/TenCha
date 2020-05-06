const file = require('../file.js');

class WordBlocker{
  constructor(){
  }

  async init(){
    if(!file.exist_check('./word_blocks.json')){
      await this.create_default_file();
    }

    try{
      var f = file.load('./word_blocks.json');
      f = JSON.parse(f);
      this.block_words = f.block_words;
    }catch(err){
      console.log(err);
      this.block_words = [];
    }
  }

  async create_default_file(){
    var default_file = {
      block_words: []
    };

    await file.json_write('./word_blocks.json', default_file);
  }

  is_block(note){
    var cw = note.no_emoji_cw;
    var text = note.no_emoji_text;
    var renote = note.renote;
    var reply = note.reply;

    var result = false;
    for(var word of this.block_words){
      var block_word = word.word;
      var word_regexp;
      if(word.regexp){
        if(word.ignore_case){
          word_regexp = new RegExp(block_word, 'gi');
        }else{
          word_regexp = new RegExp(block_word, 'g');
        }
      }else{
        word_regexp = new RegExp(this.escape_regexp(block_word), 'g');
      }

      if(cw && word_regexp.test(cw)) result = true;
      if(text && word_regexp.test(text)) result = true;
      if(renote && renote.no_emoji_cw && word_regexp.test(renote.no_emoji_cw))  result = true;
      if(renote && renote.no_emoji_text && word_regexp.test(renote.no_emoji_text)) result = true;
      if(reply && reply.no_emoji_cw && word_regexp.test(reply.no_emoji_cw)) result = true;
      if(reply && reply.no_emoji_text && word_regexp.test(reply.no_emoji_text)) result = true;
    }

    return result;
  }

  escape_regexp(str){
    return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
  }
}

module.exports = WordBlocker;
