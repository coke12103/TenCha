const { QMessageBox, QPushButton, ButtonRole } = require('@nodegui/nodegui');

class MessageBox extends QMessageBox{
  constructor(display_message, button_message){
    super();

    this.accept = new QPushButton();

    this.setText(display_message);
    this.setModal(true);

    this.accept.setText(button_message);

    this.addButton(this.accept, ButtonRole.NoRole);
  }

  onPush(callback){
    this.accept.addEventListener('clicked', function(){
        callback();
        this.close();
    }.bind(this));
  }

  close(){
    super.close();
  }
}

module.exports = MessageBox;
