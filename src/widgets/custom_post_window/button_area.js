const {
  QWidget,
  QBoxLayout,
  Direction,
  QPushButton,
  QCheckBox
} = require('@nodegui/nodegui');

class ButtonArea extends QWidget{
  constructor(){
    super();

    this.layout = new QBoxLayout(Direction.LeftToRight);

    this.post_button = new QPushButton();
    this.clear_button = new QPushButton();
    this.close_button = new QPushButton();
    this.is_after_close_check = new QCheckBox();

    this.setObjectName('buttonsArea');
    this.setLayout(this.layout);

    this.layout.setContentsMargins(0,0,0,0);
    this.layout.setSpacing(5);

    this.post_button.setObjectName('postButton');
    this.post_button.setText('投稿');

    this.clear_button.setObjectName('clearButton');
    this.clear_button.setText('クリア');

    this.close_button.setObjectName('closeButton');
    this.close_button.setText('閉じる');

    this.is_after_close_check.setObjectName('isAfterCloseCheck');
    this.is_after_close_check.setText('投稿後に閉じない');

    this.layout.addWidget(this.post_button);
    this.layout.addWidget(this.clear_button);
    this.layout.addWidget(this.close_button);
    this.layout.addWidget(this.is_after_close_check);
  }

  setFont(font){
    this.post_button.setFont(font);
    this.clear_button.setFont(font);
    this.close_button.setFont(font);
  }
}

module.exports = ButtonArea;
