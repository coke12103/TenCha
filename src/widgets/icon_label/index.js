const {
  QLabel,
  AspectRatioMode,
  TransformationMode
} = require('@nodegui/nodegui');

class IconLabel extends QLabel{
  constructor(size){
    super();
    this.maxSize = size;

    this.setMinimumSize(this.maxSize, this.maxSize);
    this.setFixedSize(this.maxSize, this.maxSize);
  }

  setPixmap(pix){
    var width = pix.width();
    var height = pix.height();

    if(width > height){
      var ratio = width / this.maxSize;

      width = this.maxSize;
      height = height / ratio;
    }else{
      var ratio = height / this.maxSize;

      width = width / ratio;
      height = this.maxSize;
    }

    width = Math.ceil(width);
    height = Math.ceil(height);

    var icon = pix.scaled(width, height, AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation);

    super.setPixmap(icon);
  }
}

module.exports = IconLabel;
