const DomainBlocker = require('./domain.js');

class Blocker{
  constructor(){
    this.blocker = [];
  }

  async init(){
    const domain_blocker = new DomainBlocker();

    var _domain_blocker_init = domain_blocker.init();

    await _domain_blocker_init;

    this.blocker.push(domain_blocker);
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
