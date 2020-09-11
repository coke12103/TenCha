const file = require('../../file.js');
const Assets = require('../../assets.js');
const App = require('../../index.js');

const request = require('request-promise');
const uuid = require('uuid');
const sleep = time => new Promise(resolve => setTimeout(resolve, time));

class EmojiCache{
  constructor(){
    this.assets = new Assets('UserAgent');
    // 必須のファイル郡の作成
    try{
      if(!file.exist_check('./tmp')) file.mkdir('./tmp');
      if(!file.exist_check('./tmp/tmplist.json')) file.json_write_sync('./tmp/tmplist.json', {tmp: []});
      this.tmplist = JSON.parse(file.load('./tmp/tmplist.json'));
      this.worked = [];
      this.lock = false;
      console.log(this.tmplist.tmp.length + ' Emojis loaded!');
    }catch(err){
      throw err;
    }
  }

  // tmplist.json
  // - String match_str
  // - String type
  // - String filename
  // - String url
  async get(req){
    var data = {
      match_str: "",
      type: "",
      url: ""
    }

    // name がある場合はMisskey Emoji
    if(req.name){
      data.match_str = req.name;
      data.type = 'MisskeyCustomEmoji';
      data.url = req.url;
    // そうでなければTwemoji
    }else{
      data.match_str = req.text;
      data.type = 'Twemoji';
      // svgではなくpngで
      data.url = req.url.replace('/v/latest/svg/', '/2/72x72/').replace('svg', 'png');
    }

    // 自分のキャッシュから参照してあったらそれを返す
    var tmp_emoji = this.tmplist.tmp.find((v) => v.url == data.url);
    if(tmp_emoji) return tmp_emoji;

    // もし自身のキャッシュになければ
    if(!data.url) throw 'url undefined';

    try{
      for(;;){
        var result = await this._cache_emoji(data);
        if(!result) await sleep(50);

        var tmp_emoji = this.tmplist.tmp.find((v) => v.url == data.url);
        if(tmp_emoji) return tmp_emoji;

        console.log('emoji loop: ', data.match_str);
      }
    }catch(err){
      throw err;
    }
  }

  async _cache_emoji(data){
    var isWork = this.worked.some((v) => v.url == data.url);
    if(isWork) return false;

    this.lock = true;
    this.worked.push(data);

    data.filename = '';

    var headers = {};
    if(App.settings.get('fake_useragent')) headers['User-Agent'] = this.assets.fake;

    var opt = {
      url: data.url,
      encoding: null,
      method: 'GET',
      headers: headers,
      resolveWithFullResponse: true
    };

    try{
      var res = await request(opt);

      data.filename = `./tmp/${uuid.v4().split('-').join('')}`;
      file.bin_write_sync(data.filename, res.body);

      this.tmplist.tmp.push(data);

      file.json_write_sync('./tmp/tmplist.json', this.tmplist);

      for(var i = 0; i < this.worked.length; i++){
        if(this.worked[i].url == data.url){
          this.worked.splice(i, 1);
          break;
        }
      }
      return true;
    }catch(err){
      console.log(err);
      for(var i = 0; i < this.worked.length; i++){
        if(this.worked[i].url == data.url){
          this.worked.splice(i, 1);
          break;
        }
      }
      throw err;
    }
  }
}

module.exports = EmojiCache;
