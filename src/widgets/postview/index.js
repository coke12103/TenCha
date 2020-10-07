const {
  QWidget,
  QBoxLayout,
  QLabel,
  QFont,
  QFontWeight,
  AlignmentFlag,
  TextInteractionFlag,
  Direction
} = require('@nodegui/nodegui');
const dateformat = require('dateformat');

const PostParser = require('../../tools/post_parser/index.js');
const NotificationParser = require('../../tools/notification_parser/index.js');
const IconLabel = require('../icon_label/index.js');
const ContentBox = require('./content_box.js');
const App = require("../../index.js");
const FlagWidget = require('./flag_widget.js');

class PostView extends QWidget{
  constructor(){
    super();

    this.layout = new QBoxLayout(Direction.LeftToRight);

    this.left = new QWidget();
    this.right = new QWidget();
    this.right_info = new QWidget();
    //this.reactions = new QWidget();

    this.left_layout = new QBoxLayout(Direction.TopToBottom);
    this.right_layout = new QBoxLayout(Direction.TopToBottom);
    this.right_info_layout = new QBoxLayout(Direction.LeftToRight);
    //this.reactions_layout = new QBoxLayout(Direction.LeftToRight);

    this.avater = new IconLabel(52);
    this.flag = new QLabel();

    this.name = new QLabel();
    this.date = new QLabel();
    this.content = new ContentBox();
    this.post_flag = new FlagWidget();

    this.post_parser = new PostParser();

    this.setObjectName("postViewArea");
    this.setLayout(this.layout);
    this.setMinimumSize(120, 120);
    this.setMaximumSize(65535, 120);

    this.layout.setContentsMargins(0,0,0,0);
    this.layout.setSpacing(5);

    this.left.setObjectName("postViewLeft");
    this.left.setLayout(this.left_layout);

    this.left_layout.setContentsMargins(0,0,0,0);
    this.left_layout.setSpacing(5);

    this.right.setObjectName("postViewRight");
    this.right.setLayout(this.right_layout);

    this.right_layout.setContentsMargins(0,0,0,0);
    this.right_layout.setSpacing(0);

    this.right_info.setObjectName('postViewRightTop');
    this.right_info.setLayout(this.right_info_layout);

    this.right_info_layout.setContentsMargins(0,0,0,0);
    this.right_info_layout.setSpacing(5);

    //this.reactions.setObjectName('postViewReactionsArea');
    //this.reactions.setLayout(this.reactions_layout);

    this.avater.setObjectName('postViewIconLabel');

    this.flag.setObjectName('postViewUserFlagLabel');
    this.flag.setAlignment(AlignmentFlag.AlignCenter);

    this.post_flag.setObjectName('postViewPostFlagLabel');

    this.name.setObjectName('postViewUserNameLabel');
    //this.name.setWordWrap(true);
    this.name.setMinimumSize(0, 16);
    this.name.setAlignment(AlignmentFlag.AlignVCenter|AlignmentFlag.AlignLeft);

    this.date.setObjectName('postViewDateLabel');
    this.date.setWordWrap(false);
    this.date.setAlignment(AlignmentFlag.AlignVCenter|AlignmentFlag.AlignRight);
    this.date.setTextInteractionFlags(TextInteractionFlag.LinksAccessibleByMouse);
    this.date.setOpenExternalLinks(true);

    this.flag.setFixedSize(52, 12);
    this.date.setFixedSize(126, 16);

    this.left_layout.addWidget(this.avater);
    this.left_layout.addWidget(this.flag);
    this.left_layout.addWidget(this.post_flag);
    this.left_layout.addStretch(1);

    this.right_info_layout.addWidget(this.name, 1);
    this.right_info_layout.addWidget(this.date);

    this.right_layout.addWidget(this.right_info);
    this.right_layout.addWidget(this.content, 1);
    //this.right_layout.addWidget(this.reactions);

    this.layout.addWidget(this.left);
    this.layout.addWidget(this.right, 1);
  }

  _parse_user_flag(user){
    var flag = '';
    if(user.isLocked) flag += '鍵';
    if(user.isBot) flag += '機';
    if(user.isCat) flag += '猫';

    if(!flag || flag == "鍵") flag += '人';

    return flag;
  }

  _parse_renote(note){
    var result = this._parse_note_text(note);

    var renote = note.renote;
    if(!renote) return result;

    var r_text = `RN @${renote.user.acct} `;
    if(result) result += " ";

    if(renote.reply){
      r_text += this._parse_reply(renote);
    }else if(renote.renote){
      r_text += this._parse_renote(renote);
    }else{
      r_text += this._parse_note_text(renote);
    }

    result += r_text;

    return result;
  }

  _parse_reply(note){
    var result = this._parse_note_text(note);
    var reply = note.reply;
    if(!reply) return result;

    var re_text;

    if(reply.renote){
      re_text = this._parse_renote(reply);
    }else if(reply.reply){
      re_text = this._parse_reply(reply);
    }else{
      re_text = this._parse_note_text(reply);
    }

    result += `\nRE: ${re_text}`;

    return result;
  }

  _parse_note_text(note){
    var result = '';
    if(note.cw){
      result = this._parse_search(note, true) + '\n------------CW------------\n';
    }
    result += this._parse_search(note, false);

    return result;
  }

  _parse_search(note, is_cw){
    var result = '';
    var from = is_cw ? note.no_emoji_cw : note.no_emoji_text;
    var from_em = is_cw ? note.cw : note.text;

    if(!from) return "";

    var from_arr = from.split('\n');
    var from_em_arr = from_em.split('\n');

    for(var i = 0; from_arr.length > i; i++){
      var text = from_arr[i];
      var _t = text;
      if(text.search(/^(^.+) (\[search\]|検索)$/i) != -1){
        _t = text.match(/^(.+) (\[search\]|検索)$/i)[1];
        _t = encodeURIComponent(_t);
        text = text.replace(/ (\[search\]|検索)$/i, '');
        text = text.replace(/:/gi, "<%3A>");
        _t = `search://${App.settings.get("search_engine")}${_t} [${text} 検索]`;
      }else{
        _t = from_em_arr[i];
      }
      result += _t + "\n";
    }

    return result;
  }
  _parse_note_content(note){
    var text;

    if(note.renote){
      text = this._parse_renote(note);
    }else if(note.reply){
      text = this._parse_reply(note);
    }else{
      text = this._parse_note_text(note);
    }
    text = this.post_parser.parse(text);

    return text;
  }

  setNote(note){
    // avater
    if(note.user.avater) this.avater.setPixmap(note.user.avater);

    // flags
    this.flag.setText(this._parse_user_flag(note.user));
    this.post_flag.setNoteFlag(note);

    // name
    var name;
    if(note.user.name){
      name = `<html>${note.user.name}/${note.user.acct}</html>`;
    }else{
      name = note.user.acct;
    }
    this.name.setText(name);

    // date
    var date = dateformat(note.createdAt, 'yyyy/mm/dd HH:MM:ss');
    var date_url = `https://${App.client.host}/notes/${note.id}`;

    this.date.setText(`<html><a style="text-decoration: none;" href="${date_url}">${date}</a>`);

    // content
    var text = this._parse_note_content(note);
    this.content.setText(text);
  }

  setNotification(notification){
    // avater
    if(notification.user.avater) this.avater.setPixmap(notification.user.avater);

    // flags
    this.flag.setText(this._parse_user_flag(notification.user));
    this.post_flag.clear();

    // name
    var name;
    if(notification.user.name){
      name = `<html>${notification.user.name}/${notification.user.acct}</html>`;
    }else{
      name = notification.user.acct;
    }
    this.name.setText(name);

    // date
    this.date.setText(dateformat(notification.createdAt, 'yyyy/mm/dd HH:MM:ss'));

    // content
    var text = NotificationParser.gen_desc_text(notification, 'postview');
    text = this.post_parser.parse(text);
    this.content.setText(text);
  }

  setFont(fontname){
    const font = new QFont(fontname, 9);
    const NameFont = new QFont(fontname, 9, QFontWeight.Bold);

    this.flag.setFont(font);
    this.name.setFont(NameFont);
    this.date.setFont(font);
    this.content.setFont(font);
  }
}

module.exports = PostView;
