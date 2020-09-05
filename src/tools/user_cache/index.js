const User = require('../../models/user.js');
const App = require('../../index.js');

class UserCache{
  constructor(){
    this.users = {};
  }

  find_id(id){
    var result = null;

    if(this.users[id]) result = this.users[id];

    return result;
  }

  async use(user){
    if(!user) throw new Error('Userがないが');
    // Userが自分のキャッシュにあるなら整形済みのそれを返す
    if(this.users[user.id]){
      // TODO: Update
      this.users[user.id].update(user);
    }else{
      // なければ作る
      try{
        this.users[user.id] = await new User(user);
      }catch(err){
        throw err;
      }
    }

    return this.users[user.id];
  }
}

module.exports = UserCache;
