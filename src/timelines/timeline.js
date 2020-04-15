const request = require("request-promise");

const Note = require('../notes.js');
const NoteItem = require('./note_item.js');
const Notification = require('../notification.js');
const NotificationItem = require('./notification_item.js');
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

  add_item(item){
    this.tl.push(item);

    this.tree.insertItem(0,item.item.list_item);
    this.tree.setItemWidget(item.item.list_item, item.item.widget);
  }

  async add_note(body, user_map){
    var note = await new Note(body.body, user_map, this.emoji_parser);
    note.item = new NoteItem(note);
    this.add_item(note);
    this.fix_items();

    if(this.auto_select){
      this.tl[this.tl.length -1].item.list_item.setSelected(true);
    }
  }

  async add_notification(body, user_map){
    if(!body.body) return;
    if(body.body.type == 'readAllUnreadMentions') return;
    if(body.body.type == 'readAllUnreadSpecifiedNotes') return;
    var notification = await new Notification(body.body, user_map, this.emoji_parser);
    notification.item = new NotificationItem(notification);
    this.add_item(notification);
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
    item.destroy();

    return;
  }

  set_auto_select(select){
    this.auto_select = select;
  }

  set_post_view(view){
    this.post_view = view;
  }

  set_emoji_parser(parser){
    this.emoji_parser = parser;
  }

  update_post_view(){
    if(this.post_view == null) return;

    try{
      var item = this.get_selected_item();
    }catch{
      return;
    }

    if(!item) return;

    if(item.el_type == 'Note'){
      this.post_view.set_note(item);
    }else if(item.el_type == 'Notification'){
      this.post_view.set_notification(item);
    }
  }

  get_selected_item(){
    var items = this.tree.selectedItems();
    var index = this.tree.row(items[0]);
    index+=1
    return this.tl[this.tl.length - index];
  }
}


module.exports = Timeline;
