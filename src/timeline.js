const request = require("request-promise");
const Note = require('./notes.js');

const {
  QLabel,
  QTreeWidgetItem,
  QTreeWidget
} = require('@nodegui/nodegui');

class Timeline{
  constructor(){
    const tree = new QTreeWidget();
    tree.setColumnCount(4);
    tree.setHeaderLabels(['種類', 'アイコン', 'ID', 'のーと']);
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
    note.item = new QTreeWidgetItem();
    tl.push(note);

    note.item.setText(0, '');
    note.item.setText(1, '');
    note.item.setText(2, note.user.acct);
    note.item.setText(3, note.text);

//    for(var n of tl){
      this.tree.addTopLevelItem(note.item);
//    }
  }

  onMess(data){
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
    var note = new Note(body.body, user_map);
    console.log(body);

    if(note.renote){
      console.log(note);
      return;
    }

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
}

module.exports = Timeline;
