class Skin{
  constructor(){
    this.skins = {};

    this.skins.sobacha = require('./note_skin/sobacha.js');
    this.skins.default_skin = require('./note_skin/default.js');
  }

  get(name){
    return this.skins[name];
  }
}

module.exports = Skin;
