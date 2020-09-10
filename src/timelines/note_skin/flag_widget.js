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

    // Center: Files
    this.clip = new QLabel();

    // Right: Visibility
    this.direct = new QLabel();
    this.home = new QLabel();
    this.lock = new QLabel();

    this.setLayout(this.layout);
    // デフォルト
    this.setMaximumSize(30, IconsSize);
    this.setMinimumSize(30, IconsSize);

    this.layout.setContentsMargins(0,0,0,0);
    this.layout.setSpacing(2);

    var clip_pix = new QPixmap(Icons.clip);
    var direct_pix = new QPixmap(Icons.direct);
    var home_pix = new QPixmap(Icons.home);
    var lock_pix = new QPixmap(Icons.lock);
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
    this.renote.setPixmap(renote_pix.scaled(
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
      else this.layout.addStretch(1);

      if(note.files[0] || (note.renote && note.renote.files[0])) this.layout.addWidget(this.clip, 1);
      else this.layout.addStretch(1);
    }else{
      var is_exist_file = (note.files[0] || (note.renote && note.renote.files[0]));

      if(is_exist_file){
        this.layout.addWidget(this.clip, 1);
      }else{
        if(note.renote) this.layout.addWidget(this.renote, 1);
        else this.layout.addStretch(1);
      }
    }

    switch(note.visibility){
      case 'public':
        this.layout.addStretch(1);
        break;
      case 'home':
        this.layout.addWidget(this.home,1);
        break;
      case 'followers':
        this.layout.addWidget(this.lock,1);
        break;
      case 'specified':
        this.layout.addWidget(this.direct,1);
        break;
      default:
        break;
    }
  }
}

module.exports = FlagWidget;
