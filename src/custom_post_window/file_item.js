const {
  QWidget,
  QLabel,
  FlexLayout,
  QPushButton,
  QLineEdit
} = require('@nodegui/nodegui');

class FileItem{
  constructor(font){
    this.item = new QWidget();
    this.layout = new FlexLayout();
    this.name_label = new QLineEdit();
    this.remove_button = new QPushButton();
    this.nsfw_button = new QPushButton();

    this.item.setLayout(this.layout);
    this.name_label.setReadOnly(true);
    this.remove_button.setText('×');
    this.nsfw_button.setText('NSFW');
    this.nsfw_button.setObjectName('nsfwButton');

    this.name_label.setFont(font);
    this.remove_button.setFont(font);
    this.nsfw_button.setFont(font);

    this.item.setStyleSheet('QWidget{ flex-direction: row; height: 20px; } QLineEdit{ flex-grow: 1; height: 20px; padding-right: 5px; } QPushButton{ width: 20px; height: 20px; } #nsfwButton{ width: 40px; height: 20px; }');


    this.layout.addWidget(this.name_label);
    this.layout.addWidget(this.nsfw_button);
    this.layout.addWidget(this.remove_button);
  }

  set_file_name(filename){
    this.name_label.setText(filename);
  }

  show(){
    this.item.show();
  }

  hide(){
    this.item.hide();
  }

  widget(){
    return this.item;
  }
}


module.exports = FileItem;
