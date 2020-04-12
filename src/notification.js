const Note = require('./notes.js');
const User = require('./users.js');

class Notification{
  constructor(notify, user_map){
    return (async () => {
      this.el_type = 'Notification';
      this.id = notify.id;
      this.createdAt = Date.parse(notify.createdAt);
      this.type = notify.type;
      this.userId = notify.userId;
      this.reaction = notify.reaction;
      this.note;

      if(notify.note){
        this.note = await new Note(notify.note, user_map);
      }

      if(notify.user){
        var _user = user_map[notify.user.id];

        if(_user){
          this.user = _user;
          await this.user.update(notify.user);
        }else{
          this.user = await new User(notify.user);
          user_map[notify.user.id] = this.user;
        }
      }

      return this;
    })();
  }
}

module.exports = Notification;
