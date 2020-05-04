const file = require('../file.js');

class DomainBlocker{
  constructor(){
  }

  async init(){
    if(!file.exist_check('./domain_blocks.json')){
      await this.create_default_file();
    }

    try{
      var f = file.load('./domain_blocks.json');
      f = JSON.parse(f);
      this.block_domains = f.block_domains;
    }catch(err){
      console.log(err);
      this.block_domains = [];
    }
  }

  async create_default_file(){
    var default_file = {
      block_domains: []
    };

    await file.json_write('./domain_blocks.json', default_file);
  }

  is_block(note){
    var host = note.user.host;

    var result = false;
    for(var domain of this.block_domains){
      if(host == domain) result = true;
    }

    return result;
  }
}

module.exports = DomainBlocker;
