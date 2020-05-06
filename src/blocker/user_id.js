const file = require('../file.js');

class UserIdBlocker{
  constructor(){
  }

  async init(){
    if(!file.exist_check('./user_id_blocks.json')){
      await this.create_default_file();
    }

    try{
      var f = file.load('./user_id_blocks.json');
      f = JSON.parse(f);
      this.block_user_ids = f.block_user_ids;
    }catch(err){
      console.log(err);
      this.block_user_ids = [];
    }
  }

  async create_default_file(){
    var default_file = {
      block_user_ids: []
    };

    await file.json_write('./user_id_blocks.json', default_file);
  }

  is_block(note){
    var u_id = note.user.username;
    var r_u_id;
    if(note.renote) r_u_id = note.renote.user.username;

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
