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
const App = require("../../index.js");

const IconsSize = 14;

class FlagWidget extends QWidget{
  constructor(){
    super();

    this.layout = new QBoxLayout(Direction.LeftToRight);

    // Left: PostType
    this.renote = new QLabel();
    this.reply = new QLabel();

    // Center: Files
    this.clip = new QLabel();

    // Right: Visibility
    this.direct = new QLabel();
    this.home = new QLabel();
    this.lock = new QLabel();

    this.local_public = new QLabel();
    this.local_home = new QLabel();
    this.local_lock = new QLabel();
    this.local_direct = new QLabel();

    this.setLayout(this.layout);
    // デフォルト
    this.setMaximumSize(30, IconsSize);
    this.setMinimumSize(30, IconsSize);

    this.layout.setContentsMargins(0,0,0,0);
    this.layout.setSpacing(2);

    var renote_pix = new QPixmap(Icons.renote);
    var reply_pix = new QPixmap(Icons.reply);

    var clip_pix = new QPixmap(Icons.clip);

    var direct_pix = new QPixmap(Icons.direct);
    var home_pix = new QPixmap(Icons.home);
    var lock_pix = new QPixmap(Icons.lock);

    var local_public_pix = new QPixmap(Icons.local_public);
    var local_home_pix = new QPixmap(Icons.local_home);
    var local_lock_pix = new QPixmap(Icons.local_lock);
    var local_direct_pix = new QPixmap(Icons.local_direct);

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
  }

  setNoteFlag(note){
    // 3行時の処理
    if(App.settings.get("full_timeline_flag_view")){
      // 上限をリセット
      this.setMaximumSize(46, IconsSize);
      this.setMinimumSize(46, IconsSize);

      if(note.renote) this.layout.addWidget(this.renote, 1);
      else if(note.reply) this.layout.addWidget(this.reply, 1);
      else this.layout.addStretch(1);

      if(note.files[0] || (note.renote && note.renote.files[0])) this.layout.addWidget(this.clip, 1);
      else this.layout.addStretch(1);
    }else{
      // 2行時の処理
      var is_exist_file = (note.files[0] || (note.renote && note.renote.files[0]));

      if(is_exist_file){
        this.layout.addWidget(this.clip, 1);
      }else{
        if(note.renote) this.layout.addWidget(this.renote, 1);
        else if(note.reply) this.layout.addWidget(this.reply, 1);
        else this.layout.addStretch(1);
      }
    }

    switch(note.visibility){
      case 'public':
        if(note.localOnly) this.layout.addWidget(this.local_public, 1);
        else this.layout.addStretch(1);
        break;
      case 'home':
        if(note.localOnly) this.layout.addWidget(this.local_home, 1)
        else this.layout.addWidget(this.home,1);
        break;
      case 'followers':
        if(note.localOnly) this.layout.addWidget(this.local_lock, 1)
        else this.layout.addWidget(this.lock,1);
        break;
      case 'specified':
        if(note.localOnly) this.layout.addWidget(this.local_direct, 1)
        else this.layout.addWidget(this.direct,1);
        break;
      default:
        break;
    }
  }
}

module.exports = FlagWidget;
