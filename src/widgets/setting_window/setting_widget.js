const {
  QWidget,
  QBoxLayout,
  Direction,
  QLabel,
  QComboBox,
  QCheckBox,
  QSpinBox,
  QLineEdit,
  QFileDialog,
  QPushButton,
  FileMode,
  QFont
} = require('@nodegui/nodegui');

const App = require('../../index.js');

class SettingWidget extends QWidget{
  constructor(setting){
    super();

    this.layout = new QBoxLayout(Direction.LeftToRight);

    this.font = new QFont(App.settings.get("font"), 9);

    this.setLayout(this.layout);

    this.layout.setContentsMargins(0,0,0,0);
    this.layout.setSpacing(5);

    this.id = setting.id;
    this.type = setting.type;

    switch(this.type){
      case "Bool":
        this.checkbox = new QCheckBox();

        this.checkbox.setText(setting.name);
        this.checkbox.setFont(this.font);

        this.layout.addWidget(this.checkbox, 1);

        break;
      case "Num":
        this.label = new QLabel();
        this.spinbox = new QSpinBox();

        this.label.setText(setting.name);
        this.label.setFont(this.font);

        if(setting.min) this.spinbox.setMinimum(setting.min);
        else this.spinbox.setMinimum(1);
        if(setting.max) this.spinbox.setMaximum(setting.max);
        else this.spinbox.setMaximum(99999999);
        this.spinbox.setFont(this.font);

        this.layout.addWidget(this.label, 1);
        this.layout.addWidget(this.spinbox);
        break;
      case "String":
        this.label = new QLabel();
        this.lineedit = new QLineEdit();

        this.label.setText(setting.name);
        this.label.setFont(this.font);

        this.lineedit.setFont(this.font);

        this.layout.addWidget(this.label, 1);
        this.layout.addWidget(this.lineedit);
        break;
      case "Path":
        this.label = new QLabel();
        this.lineedit = new QLineEdit();
        this.pushbutton = new QPushButton();

        this.label.setText(setting.name);
        this.label.setFont(this.font);

        this.lineedit.setFont(this.font);

        this.pushbutton.setText("参照");
        this.pushbutton.setFont(this.font);
        this.pushbutton.addEventListener('clicked', this.select_file.bind(this));

        this.layout.addWidget(this.label, 1);
        this.layout.addWidget(this.lineedit);
        this.layout.addWidget(this.pushbutton);
        break;
      case "Select":
        this.label = new QLabel();
        this.combobox = new QComboBox();

        this.select_values = setting.select_values;

        this.label.setText(setting.name);
        this.label.setFont(this.font);

        this.combobox.setFont(this.font);
        for(var val of setting.select_values) this.combobox.addItem(undefined, val.text);

        this.layout.addWidget(this.label, 1);
        this.layout.addWidget(this.combobox);
        break;
    }

    this.setValue(setting);
  }

  select_file(){
    const file_dialog = new QFileDialog();
    file_dialog.setFileMode(FileMode.ExistingFile);
    file_dialog.exec();

    if(file_dialog.result() != 1) return;

    this.lineedit.setText(file_dialog.selectedFiles()[0]);
    return;
  }

  value(){
    var result = {};
    result.id = this.id;

    switch(this.type){
      case "Bool":
        result.value = this.checkbox.isChecked();
        break;
      case "Num":
        result.value = this.spinbox.value();
        break;
      case "String":
      case "Path":
        result.value = this.lineedit.text();
        break;
      case "Select":
        for(var val of this.select_values){
          if(this.combobox.currentText() == val.text) result.value = val.id;
        }
        break;
      }

      return result;
  }

  setValue(setting){
    switch(this.type){
      case "Bool":
        this.checkbox.setChecked(setting.value);
        break;
      case "Num":
        this.spinbox.setValue(setting.value);
        break;
      case "String":
      case "Path":
        this.lineedit.setText(setting.value);
        break;
      case "Select":
        for(var val of this.select_values){
          if(setting.value == val.id) this.combobox.setCurrentText(val.text);
        }
        break;
    }

  }
}

module.exports = SettingWidget;
