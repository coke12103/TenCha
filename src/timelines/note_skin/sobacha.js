const {
  QLabel,
  QListWidgetItem,
  QSize,
  QWidget,
  FlexLayout,
  QFont,
  AlignmentFlag,
  ContextMenuPolicy
} = require('@nodegui/nodegui');

class SobachaSkin{
  constructor(note, font, exe){
    const list_item = new QListWidgetItem();
    const widget = new QWidget();
    const widget_layout = new FlexLayout();
    widget.setLayout(widget_layout);
    widget.setFlexNodeSizeControlled(false);
    widget.setContextMenuPolicy(ContextMenuPolicy.CustomContextMenu);
    widget.addEventListener('customContextMenuRequested', exe);

    const line_one = new QWidget();
    const line_one_layout = new FlexLayout();
    line_one.setLayout(line_one_layout);

    const icon_label = new QLabel();
    const text_label = new QLabel();
    text_label.setFlexNodeSizeControlled(false);
    text_label.setAlignment(AlignmentFlag.AlignLeft);

    // RN or RE 28px
    const item_height = 14;

    icon_label.setInlineStyle(`
      flex-grow: 1;
      width: ${item_height - 1}px;
    `);

    list_item.setSizeHint(new QSize(1200, 15 + 1));
    icon_label.setFixedSize(item_height -1, item_height -1);

    var f = new QFont(font, 9);
    text_label.setFont(f);

    line_one_layout.addWidget(icon_label);
    line_one_layout.addWidget(text_label);

    widget_layout.addWidget(line_one);

    var note_color = '#000';

    var m_text = '';
    var sub_text = '';

    if(note.renote){
      const line_two = new QWidget();
      const line_two_layout = new FlexLayout();
      line_two.setLayout(line_two_layout);

      line_two.setInlineStyle(`
        height: ${item_height}px;
        justify-content: flex-start;
        flex-direction: row;
        padding-left: 20px;
        `);

      this.line_two = line_two;
      this.line_two_layout = line_two_layout;

      const sub_icon_label = new QLabel();
      const sub_text_label = new QLabel();
      sub_icon_label.setInlineStyle(`
        flex-grow: 1;
        width: ${item_height - 1}px;
      `);
      sub_text_label.setInlineStyle(`
        padding-left: 6px;
        flex-grow: 3;
      `)
      sub_icon_label.setFixedSize(item_height -1, item_height -1);
      sub_text_label.setFont(f);

      sub_text_label.setAlignment(AlignmentFlag.AlignLeft);

      line_two_layout.addWidget(sub_icon_label);
      line_two_layout.addWidget(sub_text_label);

      widget_layout.addWidget(line_two);

      list_item.setSizeHint(new QSize(1200, 29 + 1));

      this.sub_icon_label = sub_icon_label;
      this.sub_text_label = sub_text_label;

      note_color = '#167018';
      sub_text = this._parse_renote(note);
      m_text = this._parse_note_text(note.renote);
    }else{
      if(note.reply){
        // color
        note_color = '#0b0ba9';
      }

      m_text = this._parse_note_text(note);
    }

    text_label.setText(m_text);

    if(this.line_two){
      this.sub_text_label.setText(sub_text);

      widget.setInlineStyle(`
        height: ${(item_height *2) + 1}px;
        align-items: flex-start;
        justify-content: flex-start;
        flex-direction: column;
        border-bottom: 1px solid #d6d6d6;
        `);

      if(note.user.avater){
        var s = this.sub_icon_label.size();
        var w = s.width();
        var h = s.height();
        var icon = note.user.avater.scaled(w, h);

        this.sub_icon_label.setPixmap(icon);
      }else{
        this.icon_label.setText("  ");
      }
      if(note.renote.user.avater){
        var s = icon_label.size();
        var w = s.width();
        var h = s.height();
        var icon = note.renote.user.avater.scaled(w, h);
        icon_label.setPixmap(icon);
      }else{
        icon_label.setText("  ");
      }
    }else{
      widget.setInlineStyle(`
        height: ${item_height + 1}px;
        justify-content: flex-start;
        align-items: stretch;
        flex-direction: column;
        border-bottom: 1px solid #d6d6d6;
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
    }

    line_one.setInlineStyle(`
      height: ${item_height}px;
      justify-content: flex-start;
      flex-direction: row;
      `);

    text_label.setInlineStyle(`
      padding-left: 6px;
      flex-grow: 3;
      color: ${note_color};
    `);

    this.list_item = list_item;
    this.widget = widget;
    this.widget_layout = widget_layout;
    this.line_one = line_one;
    this.line_one_layout = line_one_layout;
    this.icon_label = icon_label;
    this.text_label = text_label;
  }

  _parse_renote(note){
    var renote = note.renote;

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
    this.line_one_layout.removeWidget(this.text_label);
    this.line_one_layout.removeWidget(this.icon_label);

    this.widget_layout.removeWidget(this.line_one);

    this.text_label.close();
    this.icon_label.close();

    this.line_one.close();

    if(this.line_two){
      this.line_two_layout.removeWidget(this.sub_icon_label);
      this.line_two_layout.removeWidget(this.sub_text_label);

      this.widget_layout.removeWidget(this.line_two);

      this.sub_icon_label.close();
      this.sub_text_label.close();

      this.line_two.close();

      this.line_two = undefined;
      this.line_two_layout = undefined;
      this.sub_icon_label = undefined;
      this.sub_text_label = undefined;
    }

    this.widget.close();

    this.line_one = undefined;
    this.line_one_layout = undefined;
    this.list_item = undefined;
    this.widget = undefined;
    this.widget_layout = undefined;
    this.icon_label = undefined;
    this.text_label = undefined;
  }
}

module.exports = SobachaSkin;
