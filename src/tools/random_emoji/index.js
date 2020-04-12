const Assets = require('../../assets.js');

class RandomEmoji{
  constructor(postbox){
    const assets = new Assets("RandomEmoji");

    this.postbox = postbox;
    this.emojis = assets.emojis;
  }

  exec(){
    this.postbox.filter((input) => {
        var emoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
        var text = input.toPlainText();

        input.setPlainText(text + emoji);
    })
  }
}

module.exports = RandomEmoji;
