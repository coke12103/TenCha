const App = require('../../index.js');
const Assets = require('../../assets.js');
const VersionData = new Assets('VersionData').version_data;

class VersionParser{
  constructor(){
  }

  init(ver = null){
    if(ver) this.version = ver;
    else this.version = App.client.version;

    for(var version of Object.keys(VersionData)){
      var ver = VersionData[version];

      var regexp = new RegExp(ver.match_data, 'i');
      if(regexp.test(this.version)) this.version_info = ver;
    }

    if(!this.version_info){
      // ありえないバージョンが来た時はとりあえずv12用のプロファイルを適用する
      this.version_info = VersionData['v12'];
      console.log('なんかバージョン存在しない');
    }

    console.log(`Server version is ${this.version}`);
    console.log(`Using version info is ${this.version_info.id}`);
  }

  parse(path, data){
    var result = {
      path: path,
      data: data
    }
    var is_diff = this.version_info.diffs.some((v) => v.path == path);

    if(!is_diff) return result;

    switch(this.version_info.diffs.type){
      case "body":
        data[this.version_info.diffs.target] = this._parse_body(data[this.version_info.diffs.target]);
        break;
    }

    return result;
  }

  _parse_body(data){
    for(var diff of this.version_info.diffs.replace){
      data = data.replace(new RegExp(this.escape_regexp(diff.from)), diff.to);
    }

    return data;
  }

  escape_regexp(str){
    return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
  }
}

module.exports = VersionParser;
