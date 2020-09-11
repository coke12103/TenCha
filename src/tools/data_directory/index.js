const file = require('../../file.js');
const Assets = require('../../assets.js');
const Files = new Assets('FileList').files;

class DataDirectory{
  constructor(root = './data'){
    this.root = root;
    this.files = {};
    if(!file.exist_check(this.root)) file.mkdir(this.root);

    for(var f of Files){
      switch(f.type){
        case "dir":
          if(!file.exist_check(`${this.root}/${f.path}`)) file.mkdir(`${this.root}/${f.path}`);
          this.files[f.id] = { path: `${this.root}/${f.path}/`, type: f.type };
          break;
      }
    }
  }

  get(id){
    var result = this.files[id];
    if(!result) throw "error";

    return result.path;
  }
}

module.exports = DataDirectory;
