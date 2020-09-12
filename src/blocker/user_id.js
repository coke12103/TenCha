const file = require('../file.js');
const App = require('../index.js');

class UserIdBlocker{
  constructor(){
    if(!file.exist_check(`${App.data_directory.get('ng_settings')}user_id_blocks.json`)){
      this.create_default_file();
    }

    try{
      var f = file.load(`${App.data_directory.get('ng_settings')}user_id_blocks.json`);
      f = JSON.parse(f);
      this.block_user_ids = f.block_user_ids;
    }catch(err){
      console.log(err);
      this.block_user_ids = [];
    }
  }

  create_default_file(){
    var default_file = {
      block_user_ids: []
    };

    file.json_write_sync(`${App.data_directory.get('ng_settings')}user_id_blocks.json`, default_file);
  }

  is_block(note){
    var u_id = note.user.acct;
    var r_u_id;
    if(note.renote) r_u_id = note.renote.user.acct;

    var result = false;
    for(var id of this.block_user_ids){
      var block_id = id.id;
      var id_regexp;
      if(id.regexp){
        if(id.ignore_case){
          id_regexp = new RegExp(block_id, 'gi');
        }else{
          id_regexp = new RegExp(block_id, 'g');
        }
      }else{
        id_regexp = new RegExp(`^${this.escape_regexp(block_id)}$`, 'g');
      }

      if(id_regexp.test(u_id)) result = true;
      if(r_u_id && id_regexp.test(r_u_id)) result = true;
    }

    return result;
  }

  escape_regexp(str){
    return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
  }
}

module.exports = UserIdBlocker;
