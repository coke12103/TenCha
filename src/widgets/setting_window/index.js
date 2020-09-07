const {
  QWidget,
  QBoxLayout,
  Direction,
  WindowType,
  QPushButton
} = require('@nodegui/nodegui');

const App = require('../../index.js');
const SettingWidget = require('./setting_widget.js');

class SettingWindow extends QWidget{
  constructor(){
    super();

    this.layout = new QBoxLayout(Direction.TopToBottom);

    this.button_area = new QWidget();

    this.button_area_layout = new QBoxLayout(Direction.LeftToRight);

    this.confirm_button = new QPushButton();
    this.cancel_button = new QPushButton();

    this.widgets = {};
    for(var se of App.settings.get_settings_list()){
      this.widgets[se.id] = new SettingWidget(se);
    }

    this.setLayout(this.layout);
    this.setWindowFlag(WindowType.Window, true);
    this.setWindowTitle('設定 - TenCha');
    this.resize(360, 430);

    this.layout.setContentsMargins(5,5,5,5);
    this.layout.setSpacing(5);

    this.button_area.setLayout(this.button_area_layout);

    this.button_area_layout.setContentsMargins(0,0,0,0);
    this.button_area_layout.setSpacing(5);

    this.confirm_button.setText('OK');
    this.confirm_button.addEventListener('clicked', this.write.bind(this));

    this.cancel_button.setText('キャンセル');
    this.cancel_button.addEventListener('clicked', super.close.bind(this));

    this.button_area_layout.addStretch(1);
    this.button_area_layout.addWidget(this.confirm_button);
    this.button_area_layout.addWidget(this.cancel_button);

    for(var wi of Object.keys(this.widgets)) this.layout.addWidget(this.widgets[wi]);

    this.layout.addWidget(this.button_area);
  }

  exec(){
    this.clear();
    super.show();
  }

  clear(){
    for(var se of App.settings.get_settings_list()){
      this.widgets[se.id].setValue(se);
    }
  }

  write(){
    for(var val of Object.keys(this.widgets)){
      var value = this.widgets[val].value();
      App.settings.set(value.id, value.value);
    }
    super.close();
  }
}

module.exports = SettingWindow;
