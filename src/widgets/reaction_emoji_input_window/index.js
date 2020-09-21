const {
  QDialog,
  QWidget,
  QBoxLayout,
  Direction,
  QPushButton,
  QLabel,
  QLineEdit
} = require('@nodegui/nodegui');

const App = require('../../index.js');

class ReactionEmojiInputWindow extends QDialog{
  constructor(){
    super();

    this.layout = new QBoxLayout(Direction.TopToBottom);

    this.input_area = new QWidget();
    this.button_area = new QWidget();

    this.input_area_layout = new QBoxLayout(Direction.TopToBottom);
    this.button_area_layout = new QBoxLayout(Direction.LeftToRight);

    this.message_label = new QLabel();
    this.input = new QLineEdit();

    this.ok_button = new QPushButton();
    this.cancel_button = new QPushButton();

    this.setLayout(this.layout);
    this.setWindowTitle('絵文字入力 - TenCha');
    this.resize(300, 100);

    this.layout.setContentsMargins(5,5,5,5);
    this.layout.setSpacing(5);

    this.input_area.setLayout(this.input_area_layout);

    this.button_area.setLayout(this.button_area_layout);

    this.input_area_layout.setContentsMargins(0,0,0,0);
    this.input_area_layout.setSpacing(5);

    this.button_area_layout.setContentsMargins(0,0,0,0);
    this.button_area_layout.setSpacing(5);

    this.message_label.setText('絵文字を入力:');

    this.input.setPlaceholderText(':misskey:');

    this.ok_button.setText('おk');
    this.ok_button.setDefault(true);

    this.cancel_button.setText('やめとく');

    this.input_area_layout.addWidget(this.message_label);
    this.input_area_layout.addWidget(this.input);

    this.button_area_layout.addStretch(1);
    this.button_area_layout.addWidget(this.cancel_button);
    this.button_area_layout.addWidget(this.ok_button);

    this.layout.addWidget(this.input_area);
    this.layout.addWidget(this.button_area);

    this.cancel_button.addEventListener('clicked', function(){
        this.setResult(0);
        this.close();
    }.bind(this));

    this.ok_button.addEventListener('clicked', function(){
        this.setResult(1);
        this.close();
    }.bind(this));

    this.input.addEventListener('returnPressed', function(){
        this.setResult(1);
        this.close();
    }.bind(this));
  }

  // QFont
  setFont(font){
    this.message_label.setFont(font);
    this.input.setFont(font);
    this.ok_button.setFont(font);
    this.cancel_button.setFont(font);
  }

  getResult(){
    var result = '';
    if(this.result() == 1) result = this.input.text();
    this.input.clear();
    return result;
  }
}

module.exports = ReactionEmojiInputWindow;
