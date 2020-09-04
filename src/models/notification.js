const App = require('../index.js');

class Notification{
  constructor(notify){
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

      if(notify.note){
        this.note = await App.note_cache.get(notify.note);
        App.note_cache.use(this.note.id, 'notification');
      }

      if(this.reaction){
        if(this.note){
          this.emojis = this.note.emojis;
        }

        this.display_reaction = await App.emoji_parser.parse(this.reaction, this.emojis);
      }

      if(notify.user) this.user = await App.user_cache.use(notify.user);

      return this;
    })();
  }
}

module.exports = Notification;
