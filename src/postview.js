const {
  QWidget,
  FlexLayout,
  QLabel,
  QFont,
  QFontWeight,
  QScrollArea,
  AlignmentFlag,
  TextInteractionFlag
} = require('@nodegui/nodegui');
const dateformat = require('dateformat');
const jp_wrap = require('jp-wrap');

const PostParser = require('./tools/post_parser/index.js');

class PostView{
  constructor(){
    const font = new QFont('sans', 9);

    const postViewArea = new QWidget();
    const postViewAreaLayout = new FlexLayout();
    postViewArea.setObjectName('postViewArea');
    postViewArea.setLayout(postViewAreaLayout);
    postViewArea.setFlexNodeSizeControlled(false);

    const postViewLeft = new QWidget();
    const postViewLeftLayout = new FlexLayout();
    postViewLeft.setObjectName('postViewLeft');
    postViewLeft.setLayout(postViewLeftLayout);

    const postViewRight = new QWidget();
    const postViewRightLayout = new FlexLayout();
    postViewRight.setObjectName('postViewRight');
    postViewRight.setLayout(postViewRightLayout);
    postViewRight.setFlexNodeSizeControlled(false);

    const postViewRightTop = new QWidget();
    const postViewRightTopLayout = new FlexLayout();
    postViewRightTop.setObjectName('postViewRightTop');
    postViewRightTop.setLayout(postViewRightTopLayout);
    postViewRightTop.setFlexNodeSizeControlled(false);
    postViewRightLayout.addWidget(postViewRightTop);

    const iconLabel = new QLabel();
    iconLabel.setObjectName('postViewIconLabel');
    iconLabel.setFixedSize(52, 52);
    postViewLeftLayout.addWidget(iconLabel);

    const userFlagLabel = new QLabel();
    userFlagLabel.setObjectName('postViewUserFlagLabel');
    userFlagLabel.setFont(font);
    userFlagLabel.setAlignment(AlignmentFlag.AlignCenter);
    postViewLeftLayout.addWidget(userFlagLabel);

    const userNameLabel = new QLabel();
    const NameFont = new QFont('sans', 9, QFontWeight.Bold);
    userNameLabel.setObjectName('postViewUserNameLabel');
    userNameLabel.setFont(NameFont);
    userNameLabel.setWordWrap(true);
    userNameLabel.setAlignment(AlignmentFlag.AlignTop);
    userNameLabel.setFlexNodeSizeControlled(false);
    postViewRightTopLayout.addWidget(userNameLabel);

    const dateLabel = new QLabel();
    dateLabel.setObjectName('postViewDateLabel');
    dateLabel.setFont(font);
    dateLabel.setWordWrap(false);
    dateLabel.setFixedSize(126, 12);
    dateLabel.setAlignment(AlignmentFlag.AlignTop);
    dateLabel.setFlexNodeSizeControlled(false);
    postViewRightTopLayout.addWidget(dateLabel);

    const bodyLabel = new QLabel();
    bodyLabel.setFlexNodeSizeControlled(false);
    bodyLabel.setObjectName('postViewBodyLabel');
    bodyLabel.setFont(font);
    bodyLabel.setWordWrap(true);
    bodyLabel.setAlignment(AlignmentFlag.AlignTop);
    bodyLabel.setTextInteractionFlags(TextInteractionFlag.LinksAccessibleByMouse | TextInteractionFlag.TextSelectableByMouse);
    bodyLabel.setOpenExternalLinks(true);
    postViewRightLayout.addWidget(bodyLabel);

    const reactionsArea = new QWidget();
    const reactionsAreaLayout = new FlexLayout();
    reactionsArea.setObjectName('postViewReactionsArea');
    reactionsArea.setLayout(reactionsAreaLayout);
//    postViewRightLayout.addWidget(reactionsArea);

    postViewAreaLayout.addWidget(postViewLeft);
    postViewAreaLayout.addWidget(postViewRight);

    this.post_parser = new PostParser();

    this.area = postViewArea;
    this.area_layout = postViewAreaLayout;
    this.left = postViewLeft;
    this.left_layout = postViewLeftLayout;
    this.right = postViewRight;
    this.right_layout = postViewRightLayout;
    this.right_top = postViewRightTop;
    this.right_top_layout = postViewRightTopLayout;

    this.icon_label = iconLabel;
    this.user_flag_label = userFlagLabel;
    this.user_name_label = userNameLabel;
    this.date_label = dateLabel;
    this.body_label = bodyLabel;
  }

  get_widget(){
    return this.area;
  }

  set_note(note){
    if(note.user.avater){
      var s = this.icon_label.size();
      var w = s.width();
      var h = s.height();
      var icon = note.user.avater.scaled(w, h);
      this.icon_label.setPixmap(icon);
    }

    var flag = '';
    if(note.user.isLocked) flag = flag + '鍵';
    if(note.user.isBot) flag = flag + '機';
    if(note.user.isCat) flag = flag + '猫';

    if(!flag) flag = '人';

    this.user_flag_label.setText(flag);

    if(note.user.name){
      this.user_name_label.setText(this.post_parser.parse(note.user.name + '/' + note.user.acct));
    }else{
      this.user_name_label.setText(note.user.acct);
    }

    this.date_label.setText(dateformat(note.createdAt, 'yyyy/mm/dd HH:MM:ss'));

    var text = '';
    if(note.renote){
      var r_text = "RN @" + note.renote.user.acct + ' ';
      if(note.cw){
        text = note.cw + '\n------------CW------------\n';
        text = text + note.text;
      }else if(note.text){
        text = note.text + ' ';
      }

      if(note.renote.cw){
        r_text = r_text + note.renote.cw;
        r_text = r_text + '\n------------CW------------\n';
        r_text = r_text + note.renote.text;
      }else{
        r_text = r_text + note.renote.text;
      }

      text = text + r_text;
    }else{
      if(note.cw){
        text = note.cw + '\n------------CW------------\n';
        text = text + note.text;
      }else{
        text = note.text;
      }
    }

    //this.body_label.setText(this.wrap_text(text));
    text = this.post_parser.parse(text);
    //    this.body_label.setText(text);
    this.body_label.setText(this.wrap_text(text));

    var _s = this.area.size();
    var _w = _s.width();
    var _h = _s.height();
    this.area.resize(_w -10, _h -10);
    this.area.resize(_w +10, _h +10);
  }

  set_notification(notification){
    if(notification.user.avater){
      var s = this.icon_label.size();
      var w = s.width();
      var h = s.height();
      var icon = notification.user.avater.scaled(w, h);
      this.icon_label.setPixmap(icon);
    }

    var flag = '';
    if(notification.user.isLocked) flag = flag + '鍵';
    if(notification.user.isBot) flag = flag + '機';
    if(notification.user.isCat) flag = flag + '猫';

    if(!flag) flag = '人';

    this.user_flag_label.setText(flag);

    if(notification.user.name){
      this.user_name_label.setText(this.post_parser.parse(notification.user.name + '/' + notification.user.acct));
    }else{
      this.user_name_label.setText(notification.user.acct);
    }

    this.date_label.setText(dateformat(notification.createdAt, 'yyyy/mm/dd HH:MM:ss'));

    var text = '';
    if(notification.note && notification.note.renote){
      var r_text = "RN @" + notification.note.renote.user.acct + ' ';
      if(notification.note.cw){
        text = notification.note.cw + '\n------------CW------------\n';
        text = text + notification.note.text;
      }else if(notification.note.text){
        text = notification.note.text + ' ';
      }

      if(notification.note.renote.cw){
        r_text = r_text + notification.note.renote.cw;
        r_text = r_text + '\n------------CW------------\n';
        r_text = r_text + notification.note.renote.text;
      }else{
        r_text = r_text + notification.note.renote.text;
      }

      text = text + r_text;
    }else if(notification.note){
      if(notification.note.cw){
        text = notification.note.cw + '\n------------CW------------\n';
        text = text + notification.note.text;
      }else{
        text = notification.note.text;
      }
    }

    var desc_text;

    switch(notification.type){
      case 'follow':
        desc_text = `フォローされています!`;
        break;
      case 'mention':
      case 'reply':
        desc_text = `言及:\n${text}`;
        break;
      case 'renote':
        var text = '';
        if(notification.note.renote.cw){
          text = text + notification.note.renote.cw;
          text = text + '\n------------CW------------\n';
          text = text + notification.note.renote.text;
        }else{
          text = text + notification.note.renote.text;
        }
        desc_text = `Renoteされました!:\n${text}`;
        break;
      case 'quote':
        desc_text = `引用Renoteされました!:\n${text}`;
        break;
      case 'reaction':
        desc_text = `${notification.reaction}でリアクションされました!:\n${text}`;
        break;
      case 'pollVote':
        desc_text = `投票しました!:\n${text}`;
        break;
      case 'receiveFollowRequest':
        desc_text = `フォローリクエストされています!`;
        break;
      case 'followRequestAccepted':
        desc_text = `フォローリクエストが許可されました!`;
        break;
    }

    desc_text = this.post_parser.parse(desc_text);
    //this.body_label.setText(desc_text);
    this.body_label.setText(this.wrap_text(desc_text));

    var _s = this.area.size();
    var _w = _s.width();
    var _h = _s.height();
    this.area.resize(_w -10, _h -10);
    this.area.resize(_w +10, _h +10);
  }

  wrap_text(text){
    var base_str_size = 6.5;
    var sp_text = text.split('\n');

    var _a_s = this.area.size();
    var _l_s = this.left.size();
    var _p_s = 5;

    var right_size = _a_s.width() - (_l_s.width() + _p_s);
    var max_str_len = parseInt(right_size / base_str_size);

    var wrap = new jp_wrap(max_str_len, { breakAll: true, fullWidthSpace: false, regExs: [{pattern: /<(".*?"|'.*?'|[^'"])*?>/, width: 2}, {pattern: /(&lt;)|(&gt;)/, width: 1}] });

    var result = '';

    for(var t of sp_text){
      if(!t){
        result = result + '\n';
        continue;
      }
      result = result + wrap(t) + '\n';
    }

    return result;
  }
}

module.exports = PostView;
