const request = require("request-promise");

const Note = require('../notes.js');
const Assets = require("../assets.js");

const {
  QLabel,
  QListWidget,
  QListWidgetItem,
  QSize,
  QWidget,
  FlexLayout,
  QFont,
  SelectionMode
} = require('@nodegui/nodegui');

class Timeline{
  constructor(){
    const assets = new Assets("TimelineWidget");
    const tree = new QListWidget();
    tree.setFlexNodeSizeControlled(false);
    tree.setInlineStyle(assets.css)
//    nodegui v0.18.2 にはsetSelectionModeか何かがない
//    tree.setSelectionMode(SelectionMode.SingleSelection);

    this.tree = tree;
    this.post_view;
    this.tl = [];
  }

  get_widget(){
    this.tree.addEventListener('itemSelectionChanged', this.update_post_view.bind(this));
    return this.tree;
  }

  add_item(note){
    note.item = this.create_timeline_note(note);
    this.tl.push(note);

    this.tree.insertItem(0,note.item.list_item);
    this.tree.setItemWidget(note.item.list_item, note.item.widget);
  }

  async add_note(body, user_map){
    var note = await new Note(body.body, user_map);
    this.add_item(note);
    this.fix_items();

    if(this.auto_select){
      this.tl[this.tl.length -1].item.list_item.setSelected(true);
    }
  }

  fix_items(){
    var limit = 200;
    if(this.tl.length < limit) return;

    while(this.tl.length > limit){
      for(var i = 0; i < 10; i++){
        if(this.tl[i].item.list_item.isSelected()) return;
      }
      this.remove_item(this.tl[0].item);
      this.tl.shift();
    }
  }

  remove_item(item){
    this.tree.takeItem(this.tree.row(item.list_item));

    item.widget_layout.removeWidget(item.text_label);
    item.widget_layout.removeWidget(item.name_label);
    item.widget_layout.removeWidget(item.icon_label);
    item.widget_layout.removeWidget(item.flag_label);
    item.text_label.close();
    item.name_label.close();
    item.icon_label.close();
    item.flag_label.close();

    item.widget.close();

    item.list_item = undefined;
    item.widget = undefined;
    item.widget_layout = undefined;
    item.flag_label = undefined;
    item.icon_label = undefined;
    item.name_label = undefined;
    item.text_label = undefined;

    return;
  }

  // TODO: これのClass化
  create_timeline_note(note){
    const list_item = new QListWidgetItem();
    const widget = new QWidget();
    const widget_layout = new FlexLayout();
    widget.setLayout(widget_layout);
    widget.setFlexNodeSizeControlled(false);

    const flag_label = new QLabel();
    const icon_label = new QLabel();
    const name_label = new QLabel();
    const text_label = new QLabel();
    name_label.setFlexNodeSizeControlled(false);
    text_label.setFlexNodeSizeControlled(false);

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

    var note_color = '#000';

    if(note.renote){
      var text = "";
      var r_text = "RN @" + note.renote.user.acct + ' ';
      if(note.cw){
        text = note.cw + ' ';
        note_color = '#555753';
      }else if(note.text){
        text = note.text + ' ';
      }

      if(note.renote.cw){
        r_text = r_text + note.renote.cw;
        note_color = '#555753';
      }else{
        if(!note.renote.text) note.renote.text = '';
        r_text = r_text + note.renote.text;
      }

      text = text + r_text;
      text_label.setText(text.replace(/(\r\n|\n|\r)/gm," "));
    }else{
      if(note.cw){
        text_label.setText(note.cw.replace(/(\r\n|\n|\r)/gm," "));
        note_color = '#555753';
      }else{
        if(!note.text) note.text = '';
        text_label.setText(note.text.replace(/(\r\n|\n|\r)/gm," "));
      }
    }

    text_label.setInlineStyle(`
      flex-grow: 3;
      color: ${note_color}
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

  set_auto_select(select){
    this.auto_select = select;
  }

  set_post_view(view){
    this.post_view = view;
  }

  update_post_view(){
    if(this.post_view == null) return;

    var items = this.tree.selectedItems();
    try{
      var index = this.tree.row(items[0]);
    }catch{
      return;
    }

    index+=1
    this.post_view.set_note(this.tl[this.tl.length - index]);
  }
}


module.exports = Timeline;
