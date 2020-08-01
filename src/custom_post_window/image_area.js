const {
  QWidget,
  QFileDialog,
  QPushButton,
  FlexLayout,
  QClipboard,
  QClipboardMode,
  QApplication,
  FileMode
} = require('@nodegui/nodegui');
const fs = require('fs');
const dateformat = require('dateformat');

const FileItem = require('./file_item.js');

class ImageArea{
  constructor(){
    var clipboard = QApplication.clipboard();

    var area = new QWidget();
    var layout = new FlexLayout();
    area.setObjectName('imageArea');
    area.setLayout(layout);

    var statusArea = new QWidget();
    var statusAreaLayout = new FlexLayout();
    statusArea.setObjectName('imageStatusArea');
    statusArea.setLayout(statusAreaLayout);

    var addArea = new QWidget();
    var addAreaLayout = new FlexLayout();
    addArea.setObjectName('imageAddArea');
    addArea.setLayout(addAreaLayout);

    var selectDialogButton = new QPushButton();
    selectDialogButton.setObjectName('imageSelectDialogButton');
    selectDialogButton.setText('ファイルを選択');

    var selectClipboardButton = new QPushButton();
    selectClipboardButton.setObjectName('imageSelectClipboardButton');
    selectClipboardButton.setText('クリップボードから取得');

    var selectDriveButton = new QPushButton();
    selectDriveButton.setObjectName('imageSelectDriveButton');
    selectDriveButton.setText('ドライブから選択');

    layout.addWidget(statusArea);
    layout.addWidget(addArea);

    addAreaLayout.addWidget(selectDialogButton);
    addAreaLayout.addWidget(selectClipboardButton);
//    addAreaLayout.addWidget(selectDriveButton);

    this.clipboard = clipboard;

    this.area = area;
    this.layout = layout;

    this.status_area = statusArea;
    this.status_area_layout = statusAreaLayout;

    this.add_area = addArea;
    this.add_area_layout = addAreaLayout

    this.select_dialog_button = selectDialogButton;
    this.select_clipboard_button = selectClipboardButton;
    this.select_drive_button = selectDriveButton;

    this.select_clipboard_button.addEventListener('clicked', () => {
        this._get_file_from_clipboard();
    });

    this.select_dialog_button.addEventListener('clicked', () => {
        this._get_file_from_select();
    });

    this.file_max = 4;
    this.files = [];
  }

  widget(){
    return this.area;
  }

  set_client(client){
    this.client = client;
  }

  setup(font){
    this.font = font;
    this.select_dialog_button.setFont(font);
    this.select_clipboard_button.setFont(font);
    this.select_drive_button.setFont(font);

    for(var i = 0; i < this.file_max; i++){
      var data = {
        gui_item: new FileItem(this.font),
        isUse: false,
        data: {},
        index: i
      }

      this.files.push(data);
      this.status_area_layout.addWidget(data.gui_item.widget());
      data.gui_item.hide();
    }
  }

  get_files(){
    var result = [];

    for(var file of this.files){
      if(file.isUse){
        result.push(file.data.id);
      }
    }

    return result;
  }

  clear(){
    for(var file of this.files){
      if(file.isUse){
        file.gui_item.remove_button.click();
      }
    }
  }

  async _get_file_from_clipboard(){
    var image = this.clipboard.pixmap(QClipboardMode.Clipboard);
    if((0 >= image.width()) || (0 >= image.height())) return;

    var name = dateformat(new Date(), 'yyyy-mm-dd-HH-MM-ss.png');
    image.save('./tmp/' + name, 'PNG');
    var file = fs.createReadStream('./tmp/' + name);

    if(!file) return;
    await this._add_file(name, file);

    fs.unlinkSync('./tmp/' + name);
  }

  _get_file_from_select(){
    const file_dialog = new QFileDialog();
    file_dialog.setFileMode(FileMode.AnyFile);
    file_dialog.exec();

    var selected_files = file_dialog.selectedFiles();

    if(file_dialog.result() != 1) return;

    var file = fs.createReadStream(selected_files[0]);

    this._add_file("", file);
  }

  _get_file_from_drive(){
    // ドライブのGUI作ったら
  }

  async _add_file(name, file){
    if(!this._check_image_file_insert_ready()) return;
    var data = {
      file: file,
      name: name
    };

    try{
      var result = await this.client.call_multipart("drive/files/create", data);
      result = JSON.parse(result);
      this._insert_file(result);
    }catch(err){
      console.log(err);
      return;
    }
  }

  _check_image_file_insert_ready(){
    var result = false;
    for(var f of this.files){
      if(!f.isUse) {
        result = true;
        break;
      }
    }

    return result;
  }

  _insert_file(data){
    var i = 0;
    for(var i = 0; i < this.file_max; i++){
      var file = this.files[i];
      if(file.isUse) continue;

      var remove_func = function(i, remove_func){
        var file = this.files[i];

        file.gui_item.hide();
        file.gui_item.name_label.clear();
        file.data = {};
        file.isUse = false;
        file.gui_item.remove_button.removeEventListener('clicked', remove_func);
      }

      var toggle_nsfw_func = async function(i){
        var file = this.files[i];
        var is_sensitive = file.data.isSensitive;

        var data = {
          fileId: file.data.id,
          isSensitive: !is_sensitive
        }

        file.data = await this.client.call("drive/files/update", data);

        if(is_sensitive){
          file.gui_item.nsfw_button.setText("NSFW");
        }else{
          file.gui_item.nsfw_button.setText("普通");
        }
      }

      file.gui_item.remove_button.addEventListener('clicked', remove_func.bind(this, i, remove_func));
      file.gui_item.nsfw_button.addEventListener('clicked', toggle_nsfw_func.bind(this, i));

      file.gui_item.set_file_name(data.name);
      file.data = data;
      file.isUse = true;
      file.gui_item.show();
      break;
    }
  }
}

module.exports = ImageArea;
