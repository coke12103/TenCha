const {
  QLabel,
  QPixmap,
  TransformationMode,
  AspectRatioMode
} = require('@nodegui/nodegui');

const Assets = require("../assets.js");
const Icons = new Assets('Icons');

const IconsSize = 14;

class FlagLabel extends QLabel{
  constructor(){
    super();

    this.setMaximumSize(IconsSize, IconsSize);
    this.setMinimumSize(IconsSize, IconsSize);
  }

  setFlag(type){
    var pixmap = new QPixmap();

    switch(type){
      case 'follow':
        pixmap.load(Icons.follow);
        break;
      case 'mention':
      case 'reply':
        pixmap.load(Icons.reply);
        break;
      case 'renote':
        pixmap.load(Icons.renote);
        break;
      case 'quote':
        pixmap.load(Icons.quote);
        break;
      case 'reaction':
        pixmap.load(Icons.reaction);
        break;
      case 'pollVote':
        pixmap.load(Icons.poll);
        break;
      case 'receiveFollowRequest':
        pixmap.load(Icons.follow_request);
        break;
      case 'followRequestAccepted':
        pixmap.load(Icons.follow_accept);
        break;
    }

    pixmap = pixmap.scaled(
      IconsSize, IconsSize,
      AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation
    );

    this.setPixmap(pixmap);
  }
}

module.exports = FlagLabel;

