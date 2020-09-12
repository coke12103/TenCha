const NotificationItem = require('./notification_item.js');
const Assets = require("../assets.js");
const Skin = require("./skin.js");
const App = require("../index.js");
const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const {
  QListWidget
} = require('@nodegui/nodegui');

class Timeline extends QListWidget{
  constructor(id,limit, skin_name, exe){
    super();

    this.assets = new Assets("TimelineWidget");
    this.skin = new Skin();

    this.post_view;

    this.id = id;
    this.skin_name = skin_name;
    this.tl = [];
    this.item_queue = [];
    this.isAdd = false;
    this.limit = limit;
    this.exe = exe;
  }

  addNote(note){
    var skin = this.skin.get(this.skin_name);
    var item = new skin(note, App.settings.get("font"), this.exe);
    var data = {
      item: item,
      id: note.id,
      sort_base: note.createdAt
    };

    this.item_queue.push(data);
    this._add_item();
  }

  addNotification(notification){
    var item = new NotificationItem(notification, App.settings.get("font"));
    var data = {
      item: item,
      id: notification.id,
      sort_base: notification.createdAt
    };

    this.item_queue.push(data);
    this._add_item();
  }

  async _add_item(){
    if(this.isAdd) return;
    if(this.item_queue.length == 0) return;

    this.isAdd = true;

    var data = this.item_queue.shift();

    // 挿入位置の検索
    var pos = 1;

    for(var note of this.tl){
      if(note.sort_base > data.sort_base) break;
      pos++;
    }

    this.tl.splice(pos -1, 0, data);

    this.insertItem((this.tl.length - pos), data.item.list_item);
    this.setItemWidget(data.item.list_item, data.item.widget);

    // nodegui v0.20.0では動作しない
    //await sleep(10);

    this.isAdd = false;
    this.fix_items();
    this._add_item();
  }

  check_exist_item(id){
    var exist = this.tl.some((el, index, array) => {
        return (el.id == id);
    });

    return exist;
  }

  fix_items(){
    var limit = this.limit;
    if(this.tl.length > limit){
      for(var i = 0; i < 10; i++){
        if(this.tl[i].item.list_item.isSelected()) return;
      }
      this.remove_item(this.tl[0]);
      this.tl.shift();
    }
  }

  remove_item(item){
    this.takeItem(this.row(item.item.list_item));
    item.item.destroy();
    App.note_cache.free(item.id, this.id);

    return;
  }

  get_selected_item(){
    var items = this.selectedItems();
    var index = this.row(items[0]);
    index+=1
    return this.tl[this.tl.length - index];
  }

  select_top_item(){
    this.setCurrentRow(0);
  }

  count(){
    return this.tl.length;
  }
}

module.exports = Timeline;
