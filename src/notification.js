const Note = require('./notes.js');
const User = require('./users.js');
const App = require('./index.js');

class Notification{
  constructor(notify, user_map, parser, notes){
    return (async () => {
      this.el_type = 'Notification';
      this.id = notify.id;
      this.createdAt = Date.parse(notify.createdAt);
      this.type = notify.type;
      this.userId = notify.userId;
      this.reaction = notify.reaction;
      this.display_reaction = notify.reaction;
      this.note;
      this.emojis = [];

      if(notify.note) this.note = await new Note(notify.note, user_map, notes, parser);

      if(this.reaction){
        if(this.note){
          this.emojis = this.note.emojis;
        }

        this.display_reaction = await App.emoji_parser.parse(this.reaction, this.emojis);
      }

      if(notify.user){
        var _user = user_map[notify.user.id];

        if(_user){
          this.user = _user;
          await this.user.update(notify.user, parser);
        }else{
          this.user = await new User(notify.user, parser);
          user_map[notify.user.id] = this.user;
        }
      }

      return this;
    })();
  }
}

module.exports = Notification;
