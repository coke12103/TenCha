const {
  QLabel,
  QListWidgetItem,
  QSize,
  QWidget,
  FlexLayout,
  QFont,
  ContextMenuPolicy
} = require('@nodegui/nodegui');

function parse_flag(note){
  var result = '';

  if(note.renote){
    result = result + '♻';
  }else if(note.files[0]){
    result = result + '🖼';
  }else{
    result = result + '　';
  }

  switch(note.visibility){
    case 'public':
      break;
    case 'home':
      result = result + '⌂';
      break;
    case 'followers':
      result = result + '🔒';
      break;
    case 'specified':
      result = result + '✉';
      break;
  }

  return result;
}

class NoteItem{
  constructor(note, font, exe){
    const list_item = new QListWidgetItem();
    const widget = new QWidget();
    const widget_layout = new FlexLayout();
    widget.setLayout(widget_layout);
    widget.setFlexNodeSizeControlled(false);
    widget.setContextMenuPolicy(ContextMenuPolicy.CustomContextMenu);
    widget.addEventListener('customContextMenuRequested', exe);

    const flag_label = new QLabel();
    const icon_label = new QLabel();
    const name_label = new QLabel();
    const text_label = new QLabel();
    name_label.setFlexNodeSizeControlled(false);
    text_label.setFlexNodeSizeControlled(false);

    const item_height = 14;

    flag_label.setInlineStyle(`
      flex-grow: 1;
      width: 32px;
      margin-right: 2px;
    `);
    icon_label.setInlineStyle(`
      flex-grow: 1;
      width: ${item_height - 1}px;
    `);
    name_label.setInlineStyle(`
      flex-grow: 1;
      margin-right: 5px;
      width: 120px;
    `);

    text_label.setInlineStyle(`flex-grow: 3;`);

    list_item.setSizeHint(new QSize(1200, 15));
    flag_label.setFixedSize(32, item_height);
    icon_label.setFixedSize(item_height -1, item_height -1);
    name_label.setFixedSize(120, item_height);

    var f = new QFont(font, 9);
    text_label.setFont(f);
    name_label.setFont(f);
    flag_label.setText(f);

    widget_layout.addWidget(flag_label);
    widget_layout.addWidget(icon_label);
    widget_layout.addWidget(name_label);
    widget_layout.addWidget(text_label);

    flag_label.setText(parse_flag(note));
    name_label.setText(note.user.acct);

    var note_color = '#000';
    var note_back = 'transparent';

    var m_text = '';

    if(note.renote){
      note_back = 'rgba(119, 221, 117, 0.3)';
      m_text = this._parse_renote(note);
    }else if(note.reply){
      // color
      note_back = 'rgba(112, 116, 255, 0.3)';
      m_text = this._parse_reply(note);
    }else{
      m_text = this._parse_note_text(note);
    }

    // 1階層でしか色付かないのは後で直す
    if(note.cw){
      note_color = '#555753';
    }

    text_label.setText(m_text);

    widget.setInlineStyle(`
      height: ${item_height}px;
      justify-content: flex-start;
      flex-direction: row;
      background-color: ${note_back};
    `);

    text_label.setInlineStyle(`
      flex-grow: 3;
      color: ${note_color};
    `);

    if(note.user.avater){
      var s = icon_label.size();
      var w = s.width();
      var h = s.height();
      var icon = note.user.avater.scaled(w, h);
      icon_label.setPixmap(icon);
    }else{
      icon_label.setText("  ");
    }

    this.list_item = list_item;
    this.widget = widget;
    this.widget_layout = widget_layout;
    this.flag_label = flag_label;
    this.icon_label = icon_label;
    this.name_label = name_label;
    this.text_label = text_label;
  }

  _parse_renote(note){
    var result = this._parse_note_text(note);
    var _note = note;
    var c = 0;
    while(true){
      var renote = _note.renote;
      if(!renote || c > 2) break;

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
      _note = renote;
      c++;
    }

    return result;
  }

  _parse_reply(note){
    var result = this._parse_note_text(note);
    var _note = note;
    var c = 0;
    while(true){
      var reply = _note.reply;
      if(!reply || c > 2) break;

      if(reply.renote){
        var re_text = this._parse_renote(reply);
      }else if(reply.reply){
        var re_text = this._parse_reply(reply);
      }else{
        var re_text = this._parse_note_text(reply);
      }

      result += ` RE: ${re_text}`;
      _note = reply;
      c++;
    }

    return result;
  }

  _parse_note_text(note){
    var result;
    if(note.cw){
      result = note.cw.replace(/(\r\n|\n|\r)/gm," ");
    }else{
      if(!note.text) note.text = '';
      result = note.text.replace(/(\r\n|\n|\r)/gm," ");
    }

    return result;
  }

  destroy(){
    this.widget_layout.removeWidget(this.text_label);
    this.widget_layout.removeWidget(this.name_label);
    this.widget_layout.removeWidget(this.icon_label);
    this.widget_layout.removeWidget(this.flag_label);

    this.text_label.close();
    this.name_label.close();
    this.icon_label.close();
    this.flag_label.close();

    this.widget.close();

    this.list_item = undefined;
    this.widget = undefined;
    this.widget_layout = undefined;
    this.flag_label = undefined;
    this.icon_label = undefined;
    this.name_label = undefined;
    this.text_label = undefined;
  }
}

module.exports = NoteItem;
