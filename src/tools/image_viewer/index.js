const file = require('../../file.js');

const mime = require('mime-types');
const request = require('request-promise');
const child_process = require('child_process');

class ImageViewer{
  constructor(){}

  async init(){
    if(!file.exist_check('./user_contents')) file.mkdir('./user_contents')
    if(!file.exist_check('./content_settings.json')){
      await this.create_default_file();
    }

    try{
      var f = file.load('./content_settings.json');
      f = JSON.parse(f);
      this.file_type_match = f.file_type_match;
    }catch(err){
      console.log(err);
      this.file_type_match = [];
    }
  }

  async create_default_file(){
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

    await file.json_write('./content_settings.json', default_file);
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
    for(var f of files){
      q.push(this._download(f));
    }

    await Promise.all(q);

    child_process.exec(`${files[0].exec} ${'./user_contents/' + files[0].filename}`);
  }

  async _download(f){
    var opt = {
      url: f.url,
      encoding: null,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.72 Safari/537.36'
      }
    };

    try{
      var res = await request(opt);
      await file.bin_write("./user_contents/" + f.filename, res);
    }catch(err){
      console.log(err);
    }

    return;
  }
}

module.exports = ImageViewer;
