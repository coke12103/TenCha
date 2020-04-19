const request = require("request-promise");

const NoteItem = require('./note_item.js');
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
    return this.tree;
  }

  add_item(item, id){
    this.tl.push({item: item, id: id});

    this.tree.insertItem(0,item.list_item);
    this.tree.setItemWidget(item.list_item, item.widget);
  }

  add_note(note){
    var item = new NoteItem(note);
    this.add_item(item, note.id);
  }

  add_notification(notification){
    var item = new NotificationItem(notification);
    this.add_item(item, notification.id);
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
}


module.exports = Timeline;
