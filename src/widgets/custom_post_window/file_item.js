const {
  QWidget,
  QBoxLayout,
  QPushButton,
  QLineEdit,
  Direction
} = require('@nodegui/nodegui');

class FileItem extends QWidget{
  constructor(){
    super();

    this.layout = new QBoxLayout(Direction.LeftToRight);

    this.filename = new QLineEdit();
    this.remove_button = new QPushButton;
    this.nsfw_button = new QPushButton;

    this.setLayout(this.layout);

    this.layout.setContentsMargins(0,0,0,0);
    this.layout.setSpacing(0);

    this.filename.setReadOnly(true);

    this.remove_button.setText('×');

    this.nsfw_button.setText('NSFW');

    this.filename.setMaximumSize(65535, 20);
    this.filename.setMinimumSize(10, 20);

    this.remove_button.setFixedSize(20,20);
    this.nsfw_button.setFixedSize(40,20);

    this.layout.addWidget(this.filename, 1);
    this.layout.addWidget(this.nsfw_button);
    this.layout.addWidget(this.remove_button);
  }

  setFont(font){
    this.filename.setFont(font);
    this.remove_button.setFont(font);
    this.nsfw_button.setFont(font);
  }

  setFilename(filename){
    this.filename.setText(filename);
  }
}

module.exports = FileItem;
