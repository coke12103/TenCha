const file = require('../../file.js');
const Assets = require('../../assets.js');
const App = require('../../index.js');

const mime = require('mime-types');
const request = require('request-promise');
const child_process = require('child_process');

class ImageViewer{
  constructor(){
    this.assets = new Assets('UserAgent');
  }

  init(){
    if(!file.exist_check(`${App.data_directory.get('settings')}content_settings.json`)){
      this.create_default_file();
    }

    try{
      var f = file.load(`${App.data_directory.get('settings')}content_settings.json`);
      f = JSON.parse(f);
      this.file_type_match = f.file_type_match;
    }catch(err){
      console.log(err);
      this.file_type_match = [];
    }
  }

  create_default_file(){
    // TODO: OS別の初期設定
    var default_file = {
      file_type_match: [
        {
          type: "text",
          exec: ""
        },
        {
          type: "image",
          exec: ""
        },
        {
          type: "audio",
          exec: ""
        },
        {
          type: "video",
          exec: ""
        }
      ]
    }

    file.json_write_sync(`${App.data_directory.get('settings')}content_settings.json`, default_file);
  }

  async show(note){
    var filename_base = `cha_${note.user.username}_${note.id}_image`;
    var files = [];

    var i = 0;
    for(var f of note.files){
      for(var type of this.file_type_match){
        if(f.type.match(new RegExp(type.type, 'gi')) && type.exec){
          var ext = mime.extension(f.type);
          var _f = {
            filename: `${filename_base}${i}.${ext}`,
            url: f.url,
            exec: type.exec
          };
          files.push(_f);
          i++;
        }
      }
    }

    if(!files.length) return;

    var q = [];
    for(var f of files) q.push(this._download(f));

    await Promise.all(q);

    child_process.exec(`${files[0].exec} ${App.data_directory.get('user_contents')}${files[0].filename}`);
  }

  async _download(f){
    var headers = {};
    if(App.settings.get('fake_useragent')) headers['User-Agent'] = this.assets.fake;

    var opt = {
      url: f.url,
      encoding: null,
      method: 'GET',
      headers: headers
    };

    try{
      var res = await request(opt);
      await file.bin_write(`${App.data_directory.get('user_contents')}${f.filename}`, res);
    }catch(err){
      console.log(err);
    }

    return;
  }
}

module.exports = ImageViewer;
