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
    // TODO: アイコンを用意する。とりあえず色の差分で代用はするけど。
    this.local_home = new QLabel();
    this.local_lock = new QLabel();
    this.local_public = new QLabel()
    this.local_direct = new QLabel();

    this.setLayout(this.layout);

    this.layout.setContentsMargins(0,0,0,0);
    this.layout.setSpacing(4);

    var clip_pix = new QPixmap(Icons.clip);
    var direct_pix = new QPixmap(Icons.direct);
    var home_pix = new QPixmap(Icons.home);
    var lock_pix = new QPixmap(Icons.lock);
    var public_pix = new QPixmap(Icons._public);
    var renote_pix = new QPixmap(Icons.renote);

    direct_pix = direct_pix.scaled(
      IconsSize, IconsSize,
      AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation
    );

    home_pix = home_pix.scaled(
      IconsSize, IconsSize,
      AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation
    );

    lock_pix = lock_pix.scaled(
      IconsSize, IconsSize,
      AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation
    );

    public_pix = public_pix.scaled(
      IconsSize, IconsSize,
      AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation
    );


    this.clip.setPixmap(clip_pix.scaled(
        IconsSize, IconsSize,
        AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation
      )
    );

    this.renote.setPixmap(renote_pix.scaled(
        IconsSize, IconsSize,
        AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation
      )
    );

    this.direct.setPixmap(direct_pix);

    this.local_direct.setPixmap(direct_pix);
    this.local_direct.setEnabled(false);

    this.home.setPixmap(home_pix);

    this.local_home.setPixmap(home_pix);
    this.local_home.setEnabled(false);

    this.lock.setPixmap(lock_pix);

    this.local_lock.setPixmap(lock_pix);
    this.local_lock.setEnabled(false);

    this._public.setPixmap(public_pix);

    this.local_public.setPixmap(public_pix);
    this.local_public.setEnabled(false);

    this.layout.addStretch(1);

    this.layout.addWidget(this.clip);
    this.layout.addWidget(this.renote);

    this.layout.addWidget(this._public);
    this.layout.addWidget(this.home);
    this.layout.addWidget(this.lock);
    this.layout.addWidget(this.direct);

    this.layout.addWidget(this.local_public);
    this.layout.addWidget(this.local_home);
    this.layout.addWidget(this.local_lock);
    this.layout.addWidget(this.local_direct);

    this.layout.addStretch(1);
  }

  clear(){
    this.clip.hide();
    this.renote.hide();

    this._public.hide();
    this.home.hide();
    this.lock.hide();
    this.direct.hide();

    this.local_public.hide();
    this.local_home.hide();
    this.local_lock.hide();
    this.local_direct.hide();
  }

  setNoteFlag(note){
    this.clear();

    if(note.renote) this.renote.show();
    if(note.files[0] || (note.renote && note.renote.files[0])) this.clip.show();

    switch(note.visibility){
      case 'public':
        if(note.localOnly) this.local_public.show();
        else this._public.show();
        break;
      case 'home':
        if(note.localOnly) this.local_home.show();
        else this.home.show();
        break;
      case 'followers':
        if(note.localOnly) this.local_lock.show();
        else this.lock.show();
        break;
      case 'specified':
        if(note.localOnly) this.local_direct.show();
        else this.direct.show();
        break;
      default:
        break
    }
  }
}

module.exports = FlagWidget;
