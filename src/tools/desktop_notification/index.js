const notifier = require('node-notifier');
const path = require('path');
const winToast = new notifier.WindowsToaster({
  withFallback: false,
  customPath: path.resolve('./dist/snoreToast/snoretoast-x86.exe')
});
const App = require('../../index.js');

class DesktopNotification{
  constructor(){
  }

  show(title, message){
    if(!title) return;
    if(!App.settings.get("use_desktop_notification")) return;
    // 音とか追加するためにクラス作っとく
    if(process.platform == 'win32') {
      winToast.notify({
        appId: 'com.tencha',
        message: message,
        title: title,
        sound: false,
        wait: true
      },function(err, response) {
          console.log(err, response)
        });
    } else {
      notifier.notify({
        title: title,
        message: message
      });
    }
  }
}

module.exports = DesktopNotification;
