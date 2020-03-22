const request = require("request-promise");
const Note = require('./notes.js');

const {
  QLabel,
  QListWidget,
  QListWidgetItem,
  QSize,
  QWidget,
  FlexLayout,
  QFont
} = require('@nodegui/nodegui');

class Timeline{
  constructor(){
    const tree = new QListWidget();
    tree.setObjectName('timeline');

    this.tree = tree;
    this.tl = new Map();
    this.tl.set('notifications', []);
    this.tl.set('home', []);
    this.tl.set('local', []);
    this.tl.set('social', []);
    this.tl.set('global', []);
    this.tl.set('user_map', {});
  }

  get_widget(){
    return this.tree;
  }

  add_item(note, tl){
    note.item = this.create_timeline_note(note);
    tl.push(note);

    this.tree.insertItem(0,note.item.list_item);
    this.tree.setItemWidget(note.item.list_item, note.item.widget);
  }

  async onMess(data){
    data = JSON.parse(data);
    if(data.type != 'channel'){
      console.log(data);
      return;
    }

    var body = data.body;

    if(body.type != 'note'){
      console.log(data);
      return;
    }

    var user_map = this.tl.get('user_map');
    var note = await new Note(body.body, user_map);
    console.log(body);

//    if(note.renote){
//      console.log(note);
//      return;
//    }

    switch(data.body.id){
      case 'notification':
        break;
      case 'home':
        this.add_item(note, this.tl.get('home'));
        break;
      case 'local':
        break;
      case 'social':
        break;
      case 'global':
        break;
    }
  }

  start_streaming(statusLabel, client){
    client.connect_ws(statusLabel, this);
  }

  create_timeline_note(note){
    const list_item = new QListWidgetItem();
    const widget = new QWidget();
    const widget_layout = new FlexLayout();
    widget.setLayout(widget_layout);

    const flag_label = new QLabel();
    const icon_label = new QLabel();
    const name_label = new QLabel();
    const text_label = new QLabel();

    const item_height = 14;

    widget.setInlineStyle(`
      height: ${item_height}px;
      justify-content: flex-start;
      flex-direction: row;
    `);
    flag_label.setInlineStyle(`
      flex-grow: 1;
      width: 32px;
      margin-right: 2px;
    `);
    icon_label.setInlineStyle(`
      flex-grow: 1;
      width: ${item_height - 1}px;
      background-color: ${note.avatarColor};
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

    var f = new QFont('sans', 9);
    text_label.setFont(f);
    name_label.setFont(f);
    flag_label.setText(f);

    widget_layout.addWidget(flag_label);
    widget_layout.addWidget(icon_label);
    widget_layout.addWidget(name_label);
    widget_layout.addWidget(text_label);

    flag_label.setText(this.parse_flag(note));
    name_label.setText(note.user.acct);
    if(note.renote){
      var text = "";
      if(note.text) text = note.text + ' ';
      text_label.setText(text + 'RN @' + note.renote.user.acct + ' ' + note.renote.text.replace(/(\r\n|\n|\r)/gm," "));
    }else{
      text_label.setText(note.text.replace(/(\r\n|\n|\r)/gm," "));
    }

    if(note.user.avater){
      var s = icon_label.size();
      var w = s.width();
      var h = s.height();
      var icon = note.user.avater.scaled(w, h);
      icon_label.setPixmap(icon);
    }else{
      icon_label.setText("  ");
    }

    var result = {
      list_item: list_item,
      widget: widget,
      widget_layout: widget_layout,
      flag_label: flag_label,
      icon_label: icon_label,
      name_label: name_label,
      text_label: text_label
    }

    return result;
  }

  parse_flag(note){
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
}


module.exports = Timeline;
