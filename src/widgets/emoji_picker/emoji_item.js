const {
  QPushButton,
  QIcon,
  QSize
} = require('@nodegui/nodegui');

class EmojiItem extends QPushButton{
  constructor(emoji){
    super();

    this.icon = new QIcon(emoji.filename);

    this.setIcon(this.icon);
    this.setIconSize(new QSize(16,16));
  }
}

module.exports = EmojiItem;
