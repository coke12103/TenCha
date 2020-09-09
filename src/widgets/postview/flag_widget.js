const {
  QWidget,
  QBoxLayout,
  QLabel,
  Direction,
  QPixmap,
  TransformationMode,
  AspectRatioMode
} = require('@nodegui/nodegui');

const Assets = require("../../assets.js");
const Icons = new Assets('Icons');

const IconsSize = 14;

class FlagWidget extends QWidget{
  constructor(){
    super();

    this.layout = new QBoxLayout(Direction.LeftToRight);

    this.clip = new QLabel();
    this.direct = new QLabel();
    this.home = new QLabel();
    this.lock = new QLabel();
    this._public = new QLabel()
    this.renote = new QLabel();

    this.setLayout(this.layout);

    this.layout.setContentsMargins(0,0,0,0);
    this.layout.setSpacing(5);

    var clip_pix = new QPixmap(Icons.clip);
    var direct_pix = new QPixmap(Icons.direct);
    var home_pix = new QPixmap(Icons.home);
    var lock_pix = new QPixmap(Icons.lock);
    var public_pix = new QPixmap(Icons._public);
    var renote_pix = new QPixmap(Icons.renote);

    this.clip.setPixmap(clip_pix.scaled(
        IconsSize, IconsSize,
        AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation
      )
    );
    this.direct.setPixmap(direct_pix.scaled(
        IconsSize, IconsSize,
        AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation
      )
    );
    this.home.setPixmap(home_pix.scaled(
        IconsSize, IconsSize,
        AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation
      )
    );
    this.lock.setPixmap(lock_pix.scaled(
        IconsSize, IconsSize,
        AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation
      )
    );
    this._public.setPixmap(public_pix.scaled(
        IconsSize, IconsSize,
        AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation
      )
    );
    this.renote.setPixmap(renote_pix.scaled(
        IconsSize, IconsSize,
        AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation
      )
    );

    this.layout.addStretch(1);
    this.layout.addWidget(this.direct);
    this.layout.addWidget(this.home);
    this.layout.addWidget(this.lock);
    this.layout.addWidget(this.home);
    this.layout.addWidget(this._public);
    this.layout.addWidget(this.renote);
    this.layout.addWidget(this.clip);
    this.layout.addStretch(1);
  }

  clear(){
    this.clip.hide();
    this.direct.hide();
    this.home.hide();
    this.lock.hide();
    this.home.hide();
    this._public.hide();
    this.renote.hide();
  }

  setNoteFlag(note){
    this.clear();

    if(note.renote) this.renote.show();
    if(note.files[0] || (note.renote && note.renote.files[0])) this.clip.show();

    switch(note.visibility){
      case 'public':
        this._public.show();
        break;
      case 'home':
        this.home.show();
        break;
      case 'followers':
        this.lock.show();
        break;
      case 'specified':
        this.drect.show();
        break;
      default:
        break
    }
  }
}

module.exports = FlagWidget;
