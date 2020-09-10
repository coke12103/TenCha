const {
  QLabel,
  QListWidgetItem,
  QSize,
  QWidget,
  QBoxLayout,
  Direction,
  QFont,
  ContextMenuPolicy
} = require('@nodegui/nodegui');

const App = require('../../index.js');
const FlagWidget = require('./flag_widget.js');
const IconLabel = require('../../widgets/icon_label/index.js');

class NoteItem extends QWidget{
  constructor(note, a, exe){
    super();

    this.item_height = 14;
    this.widget = this;

    this.list_item = new QListWidgetItem();
    this.font = new QFont(App.settings.get("font"), 9);

    this.layout = new QBoxLayout(Direction.LeftToRight);

    this.flag = new FlagWidget();
    this.icon = new IconLabel(this.item_height);
    this.name = new QLabel();
    this.text = new QLabel();

    this.setLayout(this.layout);
    this.setContextMenuPolicy(ContextMenuPolicy.CustomContextMenu);
    this.addEventListener('customContextMenuRequested', exe);

    this.layout.setContentsMargins(2,0,0,1);
    this.layout.setSpacing(5);

    this.list_item.setSizeHint(new QSize(1200, this.item_height + 1));

    this.name.setFixedSize(120, this.item_height);
    this.name.setFont(this.font);

    this.text.setFont(this.font);

    this.layout.addWidget(this.flag);
    this.layout.addWidget(this.icon);
    this.layout.addWidget(this.name);
    this.layout.addWidget(this.text, 1);

    this.setNote(note);
  }

  setNote(note){
    // flags
    this.flag.setNoteFlag(note);

    // name
    this.name.setText(note.user.acct);

    // avater
    this.icon.setPixmap(note.user.avater);

    // text
    this._parse_content_text(note);

  }

  _parse_note_text(note){
    var result;
    if(note.cw){
      result = note.cw.replace(/(\r\n|\n|\r)/gm," ");
    }else{
      if(!note.text) result = '';
      else result = note.text.replace(/(\r\n|\n|\r)/gm," ");
    }

    return result;
  }

  _parse_renote(note){
    var result = this._parse_note_text(note);

    var renote = note.renote;

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

    if(reply.renote){
      var re_text = this._parse_renote(reply);
    }else if(reply.reply){
      var re_text = this._parse_reply(reply);
    }else{
      var re_text = this._parse_note_text(reply);
    }

    result += ` RE: ${re_text}`;

    return result;
  }

  _parse_content_text(note){
    var note_color = '#000';
    var note_back = 'transparent';

    var text = '';

    if(note.renote){
      note_back = 'rgba(119, 221, 117, 0.3)';
      text = this._parse_renote(note);
    }else if(note.reply){
      note_back = 'rgba(112, 116, 255, 0.3)';
      text = this._parse_reply(note);
    }else{
      text = this._parse_note_text(note);
    }

    if(note.cw){
      note_color = '#555753';
    }

    this.setInlineStyle(`background-color: ${note_back};`);
    this.text.setInlineStyle(`color: ${note_color};`);

    this.text.setText(text);
  }

  destroy(){
    this.layout.removeWidget(this.text);
    this.layout.removeWidget(this.name);
    this.layout.removeWidget(this.icon);
    this.layout.removeWidget(this.flag);

    this.text.close();
    this.name.close();
    this.icon.close();
    this.flag.close();

    this.close();

    this.list_item = undefined;
    this.widget = undefined;
    this.font = undefined;
    this.item_height = undefined;
    this.layout = undefined;
    this.flag = undefined;
    this.icon = undefined;
    this.name = undefined;
    this.text = undefined;
  }
}

module.exports = NoteItem;
