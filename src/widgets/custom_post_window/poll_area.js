const {
  QWidget,
  QBoxLayout,
  Direction,
  QPlainTextEdit,
  QCheckBox,
  QDateTimeEdit,
  QSpinBox,
  QRadioButton,
  DateFormat,
  QDate,
  QTime
} = require('@nodegui/nodegui');

class PollArea extends QWidget{
  constructor(){
    super();

    this.layout = new QBoxLayout(Direction.LeftToRight);

    this.right = new QWidget();

    this.right_layout = new QBoxLayout(Direction.TopToBottom);

    this.choices_input = new QPlainTextEdit();
    this.is_multiple_check = new QCheckBox();
    this.exp_radio_unlimited = new QRadioButton();
    this.exp_radio_at = new QRadioButton();
    this.exp_radio_after = new QRadioButton();
    this.expires_at_input = new QDateTimeEdit();
    this.expired_after_input = new QSpinBox();

    this.setObjectName('pollArea');
    this.setLayout(this.layout);

    this.layout.setContentsMargins(0,0,0,0);
    this.layout.setSpacing(5);

    this.right.setObjectName('pollAreaRight');
    this.right.setLayout(this.right_layout);

    this.right_layout.setContentsMargins(0,0,0,0);
    this.right_layout.setSpacing(5);

    this.choices_input.setObjectName('choicesInput');
    this.choices_input.setReadOnly(false);
    this.choices_input.setWordWrapMode(3);
    this.choices_input.setPlaceholderText('選択肢');

    this.is_multiple_check.setObjectName('isMultipleCheck');
    this.is_multiple_check.setText('複数選択可');

    this.exp_radio_unlimited.setObjectName('expRadioUnlimited');
    this.exp_radio_unlimited.setText('無制限');

    this.exp_radio_at.setObjectName('expRadioAt');
    this.exp_radio_at.setText('日付指定');

    this.exp_radio_after.setObjectName('expRadioAfter');
    this.exp_radio_after.setText('経過指定(ms)');

    this.expires_at_input.setObjectName('expiresAtInput');

    this.expired_after_input.setObjectName('expiredAfterInput')

    this.right_layout.addWidget(this.is_multiple_check);
    this.right_layout.addWidget(this.exp_radio_unlimited);
    this.right_layout.addWidget(this.exp_radio_at);
    this.right_layout.addWidget(this.exp_radio_after);
    this.right_layout.addWidget(this.expires_at_input);
    this.right_layout.addWidget(this.expired_after_input);

    this.layout.addWidget(this.choices_input, 1);
    this.layout.addWidget(this.right);
  }

  setFont(font){
    this.choices_input.setFont(font);
    this.is_multiple_check.setFont(font);
    this.exp_radio_unlimited.setFont(font);
    this.exp_radio_at.setFont(font);
    this.exp_radio_after.setFont(font);
    this.expires_at_input.setFont(font);
    this.expired_after_input.setFont(font);
  }

  get_poll(){
    var data = {};
    var choices = this.choices_input.toPlainText().split('\n').filter((val, i, self) => {
        return !(!(val) || !(self.indexOf(val) === i));
    });

    if(choices.length >= 2){
      data.choices = choices;
      data.multiple = this.is_multiple_check.isChecked();

      if(this.exp_radio_at.isChecked()){
        var t = this.expires_at_input.dateTime().toString(DateFormat.ISODate);
        data.expiresAt = Date.parse(t);
      }

      if(this.exp_radio_after.isChecked()){
        var t = this.expired_after_input.value();
        data.expiredAfter = t;
      }
    }else{
      return {};
    }

    return data;
  }

  clear(){
    this.choices_input.setPlainText('');
    this.is_multiple_check.setChecked(false);
    this.reset_exp_date_time();
  }

  reset_exp_date_time(){
    var _next_day = new Date();
    _next_day.setDate(_next_day.getDate() +1);

    var _d = new QDate();
    var _t = new QTime();
    _d.setDate(_next_day.getFullYear(), _next_day.getMonth(), _next_day.getDay());
    _t.setHMS(_next_day.getHours(), _next_day.getMinutes(), _next_day.getSeconds());
    this.expires_at_input.setTime(_d);
    this.expires_at_input.setDate(_t);
  }
}

module.exports = PollArea;
