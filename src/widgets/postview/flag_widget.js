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

    this.renote = new QLabel();
    this.reply = new QLabel();

    this._public = new QLabel()
    this.home = new QLabel();
    this.lock = new QLabel();
    this.direct = new QLabel();

    this.local_home = new QLabel();
    this.local_lock = new QLabel();
    this.local_public = new QLabel()
    this.local_direct = new QLabel();

    this.setLayout(this.layout);

    this.layout.setContentsMargins(0,0,0,0);
    this.layout.setSpacing(4);

    var clip_pix = new QPixmap(Icons.clip);

    var renote_pix = new QPixmap(Icons.renote);
    var reply_pix = new QPixmap(Icons.reply);

    var public_pix = new QPixmap(Icons._public);
    var home_pix = new QPixmap(Icons.home);
    var lock_pix = new QPixmap(Icons.lock);
    var direct_pix = new QPixmap(Icons.direct);

    var local_public_pix = new QPixmap(Icons.local_public);
    var local_home_pix = new QPixmap(Icons.local_home);
    var local_lock_pix = new QPixmap(Icons.local_lock);
    var local_direct_pix = new QPixmap(Icons.local_direct);

    this._public.setPixmap(public_pix.scaled(
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
    this.direct.setPixmap(direct_pix.scaled(
        IconsSize, IconsSize,
        AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation
      )
    );

    this.local_public.setPixmap(local_public_pix.scaled(
        IconsSize, IconsSize,
        AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation
      )
    );
    this.local_home.setPixmap(local_home_pix.scaled(
        IconsSize, IconsSize,
        AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation
      )
    );
    this.local_lock.setPixmap(local_lock_pix.scaled(
        IconsSize, IconsSize,
        AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation
      )
    );
    this.local_direct.setPixmap(local_direct_pix.scaled(
        IconsSize, IconsSize,
        AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation
      )
    );

    this.renote.setPixmap(renote_pix.scaled(
        IconsSize, IconsSize,
        AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation
      )
    );
    this.reply.setPixmap(reply_pix.scaled(
        IconsSize, IconsSize,
        AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation
      )
    );

    this.clip.setPixmap(clip_pix.scaled(
        IconsSize, IconsSize,
        AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation
      )
    );

    this.layout.addStretch(1);

    this.layout.addWidget(this.clip);

    this.layout.addWidget(this.renote);
    this.layout.addWidget(this.reply);

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
    this.reply.hide();

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

    if(note.reply) this.reply.show();
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
