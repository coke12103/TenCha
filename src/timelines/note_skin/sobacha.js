const {
  QLabel,
  QListWidgetItem,
  QSize,
  QWidget,
  QBoxLayout,
  Direction,
  QFont,
  AlignmentFlag,
  ContextMenuPolicy
} = require('@nodegui/nodegui');

const App = require('../../index.js');
const IconLabel = require('../../widgets/icon_label/index.js');

class SobachaSkin extends QWidget{
  constructor(note, a, exe){
    super();

    this.item_height = 14;
    this.widget = this;

    this.list_item = new QListWidgetItem();
    this.font = new QFont(App.settings.get("font"), 9);

    this.layout = new QBoxLayout(Direction.TopToBottom);

    this.line_one = new QWidget();
    this.line_two = new QWidget();

    this.line_one_layout = new QBoxLayout(Direction.LeftToRight);
    this.line_two_layout = new QBoxLayout(Direction.LeftToRight);

    this.icon = new IconLabel(14);
    this.text = new QLabel();
    this.sub_icon = new IconLabel(14);
    this.sub_text = new QLabel();

    this.setLayout(this.layout);
    this.setContextMenuPolicy(ContextMenuPolicy.CustomContextMenu);
    this.addEventListener('customContextMenuRequested', exe);

    this.layout.setContentsMargins(0,0,0,1);
    this.layout.setSpacing(0);

    this.list_item.setSizeHint(new QSize(1200, 16));

    this.line_one.setLayout(this.line_one_layout);

    this.line_two.setLayout(this.line_two_layout);

    this.line_one_layout.setContentsMargins(0,0,0,0);
    this.line_one_layout.setSpacing(6);

    this.line_two_layout.setContentsMargins(20,0,0,0);
    this.line_two_layout.setSpacing(6);

    this.text.setAlignment(AlignmentFlag.AlignLeft);
    this.text.setFont(this.font);

    this.sub_text.setAlignment(AlignmentFlag.AlignLeft);
    this.sub_text.setFont(this.font);

    this.line_one_layout.addWidget(this.icon);
    this.line_one_layout.addWidget(this.text, 1);

    this.line_two_layout.addWidget(this.sub_icon);
    this.line_two_layout.addWidget(this.sub_text, 1);

    this.layout.addWidget(this.line_one);
    this.layout.addWidget(this.line_two);

    this.setNote(note);
  }

  setNote(note){
    var note_color = '#000';

    var text = '';

    if(note.renote){
      var sub_text = '';

      this.layout.addWidget(this.line_two);
      this.list_item.setSizeHint(new QSize(1200, 30));

      note_color = '#167018';
      sub_text = this._parse_renote(note);
      text = this._parse_note_text(note.renote);

      this.sub_icon.setPixmap(note.user.avater);
      this.sub_text.setText(sub_text);

      this.icon.setPixmap(note.renote.user.avater);
    }else{
      this.line_two.hide();
      if(note.reply) note_color = '#0b0ba9';
      text = this._parse_note_text(note);

      this.icon.setPixmap(note.user.avater);
    }

    this.text.setText(text);

    this.setInlineStyle("border-bottom: 1px solid #d6d6d6;");
    this.text.setInlineStyle(`color: ${note_color};`);
  }

  _parse_renote(note){
    var r_text;
    if(note.text || note.cw){
      r_text = `QN by @${note.user.acct} `;
    }else{
      r_text = `RN by @${note.user.acct} `;
    }

    return r_text;
  }

  _parse_note_text(note){
    var result;
    if(note.cw){
      result = "CW: " + note.cw.replace(/(\r\n|\n|\r)/gm," ");
    }else{
      if(!note.text) note.text = '';
      result = note.text.replace(/(\r\n|\n|\r)/gm," ");
    }

    return result;
  }

  destroy(){
    this.line_one_layout.removeWidget(this.text);
    this.line_one_layout.removeWidget(this.icon);

    this.line_two_layout.removeWidget(this.sub_icon);
    this.line_two_layout.removeWidget(this.sub_text);

    this.layout.removeWidget(this.line_one);
    this.layout.removeWidget(this.line_two);

    this.text.close();
    this.icon.close();

    this.sub_icon.close();
    this.sub_text.close();

    this.line_one.close();
    this.line_two.close();

    this.item_height = undefined;
    this.widget = undefined;

    this.list_item = undefined;
    this.font = undefined;

    this.layout = undefined;

    this.line_one = undefined;
    this.line_one = undefined;

    this.line_one_layout = undefined;
    this.line_two_layout = undefined;

    this.icon = undefined;
    this.text = undefined;
    this.sub_icon = undefined;
    this.sub_text = undefined;

    this.close();
  }
}

module.exports = SobachaSkin;
