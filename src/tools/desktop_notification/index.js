const notifier = require('node-notifier');

class DesktopNotification{
  constructor(){
  }

  show(title, message){
    if(!title) return;
    if(!this.is_enable) return;

    // 音とか追加するためにクラス作っとく

    notifier.notify({
      title: title,
      message: message
    });
  }

  set_is_enable(is_enable){
    this.is_enable = is_enable;
  }
}

module.exports = DesktopNotification;
