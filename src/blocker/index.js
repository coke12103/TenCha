const DomainBlocker = require('./domain.js');
const WordBlocker = require('./word.js');
const UserIdBlocker = require('./user_id.js');

class Blocker{
  constructor(){
    this.blocker = [];
  }

  async init(){
    const domain_blocker = new DomainBlocker();
    const word_blocker = new WordBlocker();
    const user_id_blocker = new UserIdBlocker();

    var _word_blocker_init = word_blocker.init();
    var _user_id_blocker_init = user_id_blocker.init();
    var _domain_blocker_init = domain_blocker.init();

    await _domain_blocker_init;
    await _user_id_blocker_init;
    await _word_blocker_init;

    this.blocker.push(domain_blocker);
    this.blocker.push(word_blocker);
    this.blocker.push(user_id_blocker);
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
