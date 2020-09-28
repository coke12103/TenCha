const {
  QWidget,
  QFileDialog,
  QPushButton,
  QBoxLayout,
  QClipboardMode,
  QApplication,
  FileMode,
  Direction
} = require('@nodegui/nodegui');
const fs = require('fs');
const dateformat = require('dateformat');

const FileItem = require('./file_item.js');
const App = require('../../index.js');

class ImageArea extends QWidget{
  constructor(){
    super();

    this.clipboard = QApplication.clipboard();
    this.file_max = 4;
    this.files = [];

    this.layout = new QBoxLayout(Direction.LeftToRight);

    this.left = new QWidget();
    this.right = new QWidget();

    this.left_layout = new QBoxLayout(Direction.TopToBottom);
    this.right_layout = new QBoxLayout(Direction.TopToBottom);

    this.from_file_button = new QPushButton();
    this.from_clipboard_button = new QPushButton();
    //this.from_drive_button = new QPushButton();

    this.setObjectName('imageArea');
    this.setLayout(this.layout);

    this.layout.setContentsMargins(0,5,0,5);
    this.layout.setSpacing(5);

    this.left.setLayout(this.left_layout);
    this.left.setObjectName('imageStatusArea');

    this.left_layout.setContentsMargins(0,0,0,0);
    this.left_layout.setSpacing(0);

    this.right.setLayout(this.right_layout);
    this.right.setObjectName('imageAddArea');

    this.right_layout.setContentsMargins(0,0,0,0);
    this.right_layout.setSpacing(0);

    this.from_file_button.setObjectName('imageSelectDialogButton');
    this.from_file_button.setText('ファイルを選択');

    this.from_clipboard_button.setObjectName('imageSelectClipboardButton');
    this.from_clipboard_button.setText('クリップボードから取得');

    //this.from_drive_button.setObjectName('imageSelectDriveButton');
    //this.from_drive_button.setText('ドライブから選択');

    this.right_layout.addWidget(this.from_file_button);
    this.right_layout.addWidget(this.from_clipboard_button);
    //this.right_layout.addWidget(this.from_drive_button);

    this.layout.addWidget(this.left, 1);
    this.layout.addWidget(this.right);

    this.from_file_button.addEventListener('clicked', this._add_file.bind(this, 'file'));
    this.from_clipboard_button.addEventListener('clicked', this._add_file.bind(this, 'clipboard'));
    //this.from_drive_button.addEventListener('clicked', this._add_file.bind(this, 'drive'));

    this._setup();
  }

  setFont(font){
    this.from_file_button.setFont(font);
    this.from_clipboard_button.setFont(font);
    //this.from_drive_button.setFont(font);

    for(var f of this.files) f.item.setFont(font);
  }

  _setup(){
    for(var i = 0; i < this.file_max; i++){
      var data = {
        item: new FileItem(this.font),
        isUse: false,
        data: {},
        index: i
      }

      this.files.push(data);
      this.left_layout.addWidget(data.item);

      data.item.hide();
    }
  }

  get_files(){
    var result = [];

    for(var file of this.files){
      if(file.isUse) result.push(file.data.id);
    }

    return result;
  }

  clear(){
    for(var file of this.files){
      if(file.isUse) file.item.remove_button.click();
    }
  }

  async _add_file(type){
    if(!this._check_insert_ready()) return;

    switch(type){
      case 'clipboard':
        var image = this.clipboard.pixmap(QClipboardMode.Clipboard);

        if((0 >= image.width()) || (0 >= image.height())) return;

        var name = dateformat(new Date(), 'yyyy-mm-dd-HH-MM-ss.png');

        image.save(`${App.data_directory.get('tmp')}${name}`, 'PNG');

        var file = fs.createReadStream(`${App.data_directory.get('tmp')}${name}`);

        if(!file) return;

        await this._insert_file(name, file);

        fs.unlinkSync(`${App.data_directory.get('tmp')}${name}`);

        return;
      case 'file':
        const file_dialog = new QFileDialog();
        file_dialog.setFileMode(FileMode.AnyFile);
        file_dialog.exec();

        if(file_dialog.result() != 1) return;

        var file = fs.createReadStream(file_dialog.selectedFiles()[0]);
        this._insert_file("", file);
        return;
      case 'drive':
        return;
    }
  }

  _check_insert_ready(){
    var result = false;

    for(var f of this.files){
      if(!f.isUse) result = true;
    }

    return result;
  }

  async _insert_file(name, file){
    var data = {
      file: file,
      name: name
    };

    try{
      data = await App.client.call_multipart("drive/files/create", data);
      data = JSON.parse(data);
    }catch(err){
      console.log(err);
      return;
    }

    this.insertFile(data);
  }

  insertFile(data){
    for(var i = 0; i < this.file_max; i++){
      var file = this.files[i];
      if(file.isUse) continue;

      var remove_func = function(i, remove_func){
        var file = this.files[i];

        file.item.hide();
        file.item.filename.clear();
        file.data = {};
        file.isUse = false;
        file.item.remove_button.removeEventListener('clicked', remove_func);
      }.bind(this, i, remove_func);

      var toggle_nsfw = async function(i){
        var file = this.files[i];
        var is_sensitive = file.data.isSensitive;

        var data = {
          fileId: file.data.id,
          isSensitive: !is_sensitive
        }

        file.data = await App.client.call("drive/files/update", data);

        if(is_sensitive) file.item.nsfw_button.setText("NSFW");
        else file.item.nsfw_button.setText("普通");
      }.bind(this, i);

      console.log(data.isSensitive);
      if(data.isSensitive) file.item.nsfw_button.setText("普通");
      else file.item.nsfw_button.setText("NSFW");

      file.item.remove_button.addEventListener('clicked', remove_func);
      file.item.nsfw_button.addEventListener('clicked', toggle_nsfw);

      file.item.setFilename(data.name);
      file.data = data;
      file.isUse = true;
      file.item.show();
      break;
    }
  }
}

module.exports = ImageArea;
