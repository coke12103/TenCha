const file = require('../../file.js');
const request = require('request-promise');
const uuid = require('uuid');

class EmojiCache{
  constructor(){
    return (async () => {
      if(!file.exist_check('./tmp')) file.mkdir('./tmp');
      if(!file.exist_check('./tmp/tmplist.json')) await file.json_write('./tmp/tmplist.json', {tmp: []});

      this.tmplist = JSON.parse(file.load('./tmp/tmplist.json'));
      this.worked = [];
      return this;
    })();
  }

  // tmplist.json
  // - String match_str
  // - String type
  // - String filename
  // - String url
  async get(match_obj){
    var _emoji;
    var _match;
    var _type;
    var _url;

    // check match type
    if(match_obj.name){
      // Misskey Custom Emoji
      _match = match_obj.name;
      _type = 'MisskeyCustomEmoji'
      _url = match_obj.url;
    }else{
      // Twemoji
      _match = match_obj.text;
      _type = 'Twemoji';
      _url = match_obj.url.replace('/v/latest/svg/', '/2/72x72/');
      _url = _url.replace('svg', 'png')
    }

    for(var emoji of this.tmplist.tmp){
      if(_url == emoji.url){
        return emoji;
      }
    }

    if(!_emoji){
      try{
        var _emoji = await this._cache_emoji(_match, _type, _url);
      }catch(err){
        throw err;
      }
    }

    return _emoji;
  }

  async _cache_emoji(match_str, type, url){
    for(var e of this.worked){
      if(e.str == match_str && e.type == type) return;
    }
    this.worked.push({str: match_str, type: type});

    var data = {
      match_str: match_str,
      type: type,
      filename: '',
      url: url
    };

    var opt = {
      url: url,
      encoding: null,
      method: 'GET',
      resolveWithFullResponse: true
    };

    try{
      var res = await request(opt);
      var _filename = uuid.v4().split('-').join('');
      data.filename = './tmp/' + _filename;
      await file.bin_write(data.filename, res.body);
      this.tmplist.tmp.push(data);
      await this._write_list();
      var i = 0;
      for(var e of this.worked){
        if(e.str == match_str && e.type == type){
          this.worked.splice(i, 1);
          break;
        };
        i++;
      }
    }catch(err){
      console.log(err);
      throw err;
    }

    return data;
  }

  async _write_list(){
    try{
      await file.json_write('./tmp/tmplist.json', this.tmplist);
      return;
    }catch(err){
      throw err;
    }
  }
}

module.exports = EmojiCache;
