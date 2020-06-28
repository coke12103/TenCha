const {
  QWidget,
  FlexLayout,
  QPlainTextEdit,
  QCheckBox,
  QDateTimeEdit,
  QSpinBox,
  QRadioButton,
  DateFormat,
  QDate,
  QTime
} = require('@nodegui/nodegui');

class PollArea{
  constructor(){
    // PollAreaLeft + PollAreaRight
    var area = new QWidget();
    var layout = new FlexLayout();
    area.setObjectName('pollArea');
    area.setLayout(layout);

    // choices
    var left = new QWidget();
    var leftLayout = new FlexLayout();
    left.setObjectName('pollAreaLeft');
    left.setLayout(leftLayout);

    // multiple + expiresAt + expiredAfter
    var right = new QWidget();
    var rightLayout = new FlexLayout();
    right.setObjectName('pollAreaRight');
    right.setLayout(rightLayout);

    var choicesInput = new QPlainTextEdit();
    choicesInput.setObjectName('choicesInput');
    choicesInput.setReadOnly(false);
    choicesInput.setWordWrapMode(3);
    choicesInput.setPlaceholderText('選択肢');

    var isMultipleCheck = new QCheckBox();
    isMultipleCheck.setObjectName('isMultipleCheck');
    isMultipleCheck.setText('複数選択可');

    var expRadioUnlimited = new QRadioButton();
    expRadioUnlimited.setObjectName('expRadioUnlimited');
    expRadioUnlimited.setText('無制限')

    var expRadioAt = new QRadioButton();
    expRadioAt.setObjectName('expRadioAt');
    expRadioAt.setText('日付指定');

    var expRadioAfter = new QRadioButton();
    expRadioAfter.setObjectName('expRadioAfter');
    expRadioAfter.setText('経過指定(ms)');

    var expiresAtInput = new QDateTimeEdit();
    expiresAtInput.setObjectName('expiresAtInput');

    var expiredAfterInput = new QSpinBox();
    expiredAfterInput.setObjectName('expiredAfterInput');

    layout.addWidget(left);
    layout.addWidget(right);

    leftLayout.addWidget(choicesInput);

    rightLayout.addWidget(isMultipleCheck);
    rightLayout.addWidget(expRadioUnlimited);
    rightLayout.addWidget(expRadioAt);
    rightLayout.addWidget(expRadioAfter);
    rightLayout.addWidget(expiresAtInput);
    rightLayout.addWidget(expiredAfterInput);

    this.area = area;
    this.ayout = layout;

    this.left = left;
    this.left_layout = leftLayout;

    this.right = right;
    this.right_layout = rightLayout;

    this.choices_input = choicesInput;

    this.is_multiple_check = isMultipleCheck;

    this.exp_radio_unlimited = expRadioUnlimited;
    this.exp_radio_at = expRadioAt;
    this.exp_radio_after = expRadioAfter;

    this.expires_at_input = expiresAtInput;
    this.expires_after_input = expiredAfterInput;

  }

  setup(font){
    this.choices_input.setFont(font);
    this.is_multiple_check.setFont(font);
    this.exp_radio_unlimited.setFont(font);
    this.exp_radio_at.setFont(font);
    this.exp_radio_after.setFont(font);
    this.expires_at_input.setFont(font);
    this.expires_after_input.setFont(font);
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
        var t = this.expires_after_input.value();
        data.expiredAfter = t;
      }
    }else{
      return {};
    }

    return data;
  }

  clear(){
    this.choices_input.setPlainText('');
    this.reset_exp_date_time();
  }

  // 動かないけど悪影響もないので動いたらラッキー程度で
  reset_exp_date_time(){
    var _next_day = new Date();
    _next_day.setDate(_next_day.getDate() + 1);
    var _d = new QDate();
    var _t = new QTime();
    _d.setDate(_next_day.getFullYear(), _next_day.getMonth(), _next_day.getDay());
    _t.setHMS(_next_day.getHours(), _next_day.getMinutes(), _next_day.getSeconds());
    this.expires_at_input.setTime(_d);
    this.expires_at_input.setDate(_t);
  }

  widget(){
    return this.area;
  }

}

module.exports = PollArea;
