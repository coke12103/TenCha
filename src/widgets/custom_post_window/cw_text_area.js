const {
  QWidget,
  QBoxLayout,
  Direction,
  QPlainTextEdit
} = require('@nodegui/nodegui');

class CwTextArea extends QWidget{
  constructor(){
    super();

    this.layout = new QBoxLayout(Direction.LeftToRight);

    this.text_input = new QPlainTextEdit();
    this.visible_user_ids_input = new QPlainTextEdit();

    this.setObjectName('cwTextArea');
    this.setLayout(this.layout);

    this.layout.setContentsMargins(0,0,0,0);
    this.layout.setSpacing(5);

    this.text_input.setObjectName('cwTextInput');
    this.text_input.setReadOnly(false);
    this.text_input.setWordWrapMode(3);
    this.text_input.setPlaceholderText('ここに警告文を入力します');

    this.visible_user_ids_input.setObjectName('visibleUserIdsInput');
    this.visible_user_ids_input.setReadOnly(false);
    this.visible_user_ids_input.setWordWrapMode(3);
    this.visible_user_ids_input.setPlaceholderText('閲覧を許可するユーザーのID');

    this.visible_user_ids_input.setFixedSize(99,76);

    this.layout.addWidget(this.text_input, 1);
    this.layout.addWidget(this.visible_user_ids_input);
  }

  setFont(font){
    this.text_input.setFont(font);
    this.visible_user_ids_input.setFont(font);
  }

  setVisbleUserIds(visible_user_ids){
    this.visible_user_ids_input.setPlainText(visible_user_ids.join('\n'));
  }

  getInfo(){
    var visible_user_ids = this.visible_user_ids_input.toPlainText().split('\n').filter((val, i, self) => {
        return !(!(val) || !(self.indexOf(val) === i));
    });

    return {
      cw: this.text_input.toPlainText(),
      visibleUserIds: visible_user_ids
    }
  }

  clear(){
    this.text_input.setPlainText('');
    this.visible_user_ids_input.setPlainText('');
  }
}

module.exports = CwTextArea;
