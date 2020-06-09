const Assets = require('../../assets.js');

class RandomEmoji{
  constructor(){
    const assets = new Assets("RandomEmoji");

    this.emojis = assets.emojis;
  }

  exec(){
    var emoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
    return emoji;
  }
}

module.exports = RandomEmoji;
