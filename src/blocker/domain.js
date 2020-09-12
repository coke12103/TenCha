const file = require('../file.js');
const App = require('../index.js');

class DomainBlocker{
  constructor(){
    if(!file.exist_check(`${App.data_directory.get('ng_settings')}domain_blocks.json`)){
      this.create_default_file();
    }

    try{
      var f = file.load(`${App.data_directory.get('ng_settings')}domain_blocks.json`);
      f = JSON.parse(f);
      this.block_domains = f.block_domains;
    }catch(err){
      console.log(err);
      this.block_domains = [];
    }
  }

  create_default_file(){
    var default_file = {
      block_domains: []
    };

    file.json_write_sync(`${App.data_directory.get('ng_settings')}domain_blocks.json`, default_file);
  }

  is_block(note){
    var result = false;
    for(var domain of this.block_domains){
      if(note.user.host == domain) result = true;
      if(note.renote && note.renote.user.host == domain) result = true;
    }

    return result;
  }
}

module.exports = DomainBlocker;
