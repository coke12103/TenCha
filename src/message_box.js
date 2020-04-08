const { QMessageBox, QPushButton, ButtonRole } = require('@nodegui/nodegui');

class MessageBox{
  constructor(display_message, button_message){
    var box = new QMessageBox();
    var accept = new QPushButton();

    box.setText(display_message);
    accept.setText(button_message);

    box.addButton(accept, ButtonRole.NoRole);

    this.box = box;
    this.accept = accept;
  }
  onPush(callback){
    this.accept.addEventListener('clicked', callback);
  }
  exec(){
    this.box.show();
  }
  close(){
    this.box.close();
  }
}

module.exports = MessageBox;
