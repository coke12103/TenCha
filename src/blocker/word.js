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
    var cw = note.cw;
    var text = note.text;
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
      if(renote && renote.cw && word_regexp.test(renote.cw))  result = true;
      if(renote && renote.text && word_regexp.test(renote.text)) result = true;
      if(reply && reply.cw && word_regexp.test(reply.cw)) result = true;
      if(reply && reply.text && word_regexp.test(reply.text)) result = true;
    }

    return result;
  }

  escape_regexp(str){
    return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
  }
}

module.exports = WordBlocker;
