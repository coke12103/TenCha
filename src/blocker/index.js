const DomainBlocker = require('./domain.js');
const WordBlocker = require('./word.js');
const UserIdBlocker = require('./user_id.js');
const ReplaceBlocker = require('./replace.js');

class Blocker{
  constructor(){
    this.blocker = [];
  }

  async init(){
    const domain_blocker = new DomainBlocker();
    const word_blocker = new WordBlocker();
    const user_id_blocker = new UserIdBlocker();
    const replace_blocker = new ReplaceBlocker();

    var _word_blocker_init = word_blocker.init();
    var _replace_blocker_init = replace_blocker.init();
    var _user_id_blocker_init = user_id_blocker.init();

    await _user_id_blocker_init;
    await _word_blocker_init;
    await _replace_blocker_init;

    this.blocker.push(domain_blocker);
    this.blocker.push(word_blocker);
    this.blocker.push(user_id_blocker);
    this.blocker.push(replace_blocker);
  }

  is_block(note){
    var result = false;

    for(var block of this.blocker){
      var b = block.is_block(note);
      if(b) result = true;
    }

    return !result;
  }
}

module.exports = Blocker;
