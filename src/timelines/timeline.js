const request = require("request-promise");

const NoteItem = require('./note_item.js');
const NotificationItem = require('./notification_item.js');
const Assets = require("../assets.js");
const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const {
  QLabel,
  QListWidget,
  QListWidgetItem,
  QSize,
  QWidget,
  FlexLayout,
  SelectionMode
} = require('@nodegui/nodegui');

class Timeline{
  constructor(font){
    const assets = new Assets("TimelineWidget");
    const tree = new QListWidget();
    tree.setFlexNodeSizeControlled(false);
    tree.setInlineStyle(assets.css)
//    nodegui v0.18.2 にはsetSelectionModeか何かがない
//    tree.setSelectionMode(SelectionMode.SingleSelection);

    this.tree = tree;
    this.post_view;
    this.tl = [];
    this.item_queue = [];
    this.is_now_add = false;
    this.font = font;
  }

  get_widget(){
    return this.tree;
  }

  add_item(item, id, sort_base){
    var data = { item: item, id: id, sort_base: sort_base };
    this.item_queue.push(data);

    this._add_item();
  }

  async _add_item(){
    if(this.is_now_add) return;
    if(this.item_queue.length == 0) return;
    this.is_now_add = true;

    var data = this.item_queue.shift();

    var pos = this.search_insert_pos(data.sort_base);
    this.tl.splice(pos -1, 0, data);

    this.tree.insertItem((this.tl.length - pos), data.item.list_item);
    this.tree.setItemWidget(data.item.list_item, data.item.widget);

    // nodegui v0.20.0では動作しない
    // await sleep(10);

    this.is_now_add = false;
    this._add_item();
  }

  add_note(note){
    var item = new NoteItem(note, this.font);
    this.add_item(item, note.id, note.createdAt);
  }

  add_notification(notification){
    var item = new NotificationItem(notification, this.font);
    this.add_item(item, notification.id, notification.createdAt);
  }

  check_exist_item(id){
    var exist = this.tl.some((el, index, array) => {
        return (el.id == id);
    });

    if(exist) console.log('Exist');
    return exist;
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

  get_selected_item(){
    var items = this.tree.selectedItems();
    var index = this.tree.row(items[0]);
    index+=1
    return this.tl[this.tl.length - index];
  }

  select_top_item(){
    this.tree.setCurrentRow(0);
  }

  search_insert_pos(base){
    var tl = this.tl;
    var i = 1;

    for(var note of tl){
      if(note.sort_base > base) break;
      i++;
    }

    return i;
  }
}


module.exports = Timeline;
