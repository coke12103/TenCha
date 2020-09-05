const Notification = require('../../models/notification.js');
const App = require('../../index.js');

class NotificationCache{
  constructor(){
    this.notifications = {};
  }

  find_id(id){
    var result = null;

    if(this.notifications[id]) result = this.notifications[id];

    return result;
  }

  async get(notification){
    if(!notification) return null;
    if(notification.type == 'readAllUnreadMentions') return null;
    if(notification.type == 'readAllUnreadSpecifiedNotes') return null;

    // notificationが自分のキャッシュにあるなら整形済みのそれを返す
    if(this.notifications[notification.id]){
      this.notifications[notification.id].update(notification);
    }else{
      // なければ作る
      try{
        this.notifications[notification.id] = await new Notification(notification);
      }catch(err){
        throw err;
      }
    }

    return this.notifications[notification.id];
  }
}

module.exports = NotificationCache;
