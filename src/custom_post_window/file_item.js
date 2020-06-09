const {
  QWidget,
  QLabel,
  FlexLayout,
  QPushButton
} = require('@nodegui/nodegui');

class FileItem{
  constructor(font){
    this.item = new QWidget();
    this.layout = new FlexLayout();
    this.name_label = new QLabel();
    this.name_label.setFixedSize(198, 20);
    this.remove_button = new QPushButton();

    this.item.setLayout(this.layout);
    this.remove_button.setText('×');

    this.name_label.setFont(font);
    this.remove_button.setFont(font);

    this.item.setStyleSheet('QWidget{ flex-direction: row; height: 20px; } QLable{ width: 198px; height: 20px; } QPushButton{ width: 20px; height: 20px; }');

    this.layout.addWidget(this.remove_button);
    this.layout.addWidget(this.name_label);
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
