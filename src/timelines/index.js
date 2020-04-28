const {
  QTabWidget,
  QIcon,
  QFont
} = require('@nodegui/nodegui');

const TabLoader = require('./tab_loader.js');
const Timeline = require('./timeline.js');
const Note = require('../notes.js');
const Notification = require('../notification.js');
const NotificationParser = require('../tools/notification_parser/index.js');

class Timelines{
  constructor(){
    const font = new QFont('sans', 9);
    const tabWidget = new QTabWidget();
    tabWidget.setObjectName('timelines');
    tabWidget.setFont(font);

    this.tab_widget = tabWidget;
    this.tabs = [];
    this.users = {};
    this.notes = {};
    this.sources = {};
    this.filters = [];
  }

  get_widget(){
    return this.tab_widget;
  }

  async init(){
    var loader = new TabLoader();

    try{
      var tabs = await loader.load();
      tabs = tabs.tabs;
    }catch(err){
      console.log(err);
      await this._show_mes_dialog('タブのロードに失敗しました!\ntabs.jsonを削除するか自力で直してください!');
      process.exit(1);
    }

    for(var tab of tabs){
      await this.set_timeline(tab);
    }
  }

  async set_timeline(tab){
    var data = {
      id: tab.id,
      name: tab.name,
      source: tab.source,
      timeline: new Timeline(),
      is_auto_select: false,
      post_view: false
    }

    this.tabs.push(data);

    data.timeline.tree.addEventListener('itemSelectionChanged', this._update_post_view.bind(this));
    this.tab_widget.addTab(data.timeline.get_widget(), new QIcon(), data.name);
  }

  start_streaming(statusLabel, client){
    this.start_load_tl(client);
    client.connect_ws(statusLabel, this);
    this.change_tab();
  }

  async start_load_tl(client){
    var data = {
      limit: 40
    };

    var calls = [
      { source: 'global',       call: 'notes/global-timeline' },
      { source: 'social',       call: 'notes/hybrid-timeline' },
      { source: 'local',        call: 'notes/local-timeline'  },
      { source: 'home',         call: 'notes/timeline'        },
      { source: 'notification', call: 'i/notifications'       }
    ];

    for(var c of calls){
      var posts = await client.call(c.call, data);
      for(var note of posts){
        this.add_tl_mess(c.source, note);
      }
    }
  }

  onMess(data){
    data = JSON.parse(data);
    if(data.type != 'channel'){
      console.log(data);
      return;
    }

    var body = data.body;

    if(!(body.type == 'note') && !(body.type == 'notification')){
      console.log(data);
      return;
    }

    switch(body.id){
      case 'notification':
        this.add_tl_mess(body.id, body.body).then(() => {
          var _body = body.body;
          var _notification = this.notes[_body.id];
          if(!_notification) return;

          var d_notification_text = NotificationParser.gen_desc_text(_notification, 'desktop_notification');
          this.desktop_notification.show(d_notification_text.title, d_notification_text.message);
        });
        break;
      case 'home':
      case 'local':
      case 'social':
      case 'global':
        this.add_tl_mess(body.id, body.body);
        break;
    }
  }

  async add_tl_mess(id, body){
    for(var tab of this.tabs){
      if(tab.source == id){
        if(tab.source == 'notification'){
          var item = await this.create_notification(body, this.users);
          if(!tab.timeline.check_exist_item(item.id)) tab.timeline.add_notification(item);
        }else{
          var item = await this.create_note(body, this.users);
          if(!tab.timeline.check_exist_item(item.id)) tab.timeline.add_note(item);
        }

        if(tab.is_auto_select){
          tab.timeline.select_top_item();
        }
        tab.timeline.fix_items();
      }
    }

    console.log(Object.keys(this.notes).length);
    this.fix_notes();
  }

  async fix_notes(){
    var notes = this.notes;
    var limit = 5000;
    if(Object.keys(this.notes).length < limit) return;

    var i = 0;
    for(var c = 0; c < limit; c++){
      var is_exist = false;
      for(var tab of this.tabs){
        if(tab.timeline.check_exist_item(notes[Object.keys(notes)[i]].id)){
          is_exist = true;
          break;
        }
      }
      if(is_exist){
        i++;
        continue;
      }

      console.log('removeing: ' + notes[Object.keys(notes)[i]]);
      delete this.notes[Object.keys(this.notes)[i]];
    }
  }

  async create_note(body, user_map){
    var _note = this.notes[body.id];
    var note;
    if(_note){
      note = _note;
      // TODO: update note
    }else{
      var note = await new Note(body, user_map, this.emoji_parser);
      this.notes[body.id] = note;
    }

    return note;
  }

  async create_notification(body, user_map){
    if(!body) return;
    if(body.type == 'readAllUnreadMentions') return;
    if(body.type == 'readAllUnreadSpecifiedNotes') return;
    var _notification = this.notes[body.id];
    var notification;
    if(_notification){
      notification = _notification;
      // TODO: update
    }else{
      notification = await new Notification(body, user_map, this.emoji_parser);
      this.notes[body.id] = notification;
    }

    return notification;
  }

  set_post_view(view){
    this.post_view = view;
    this.tab_widget.addEventListener('currentChanged', this.change_tab.bind(this));
  }

  change_tab(){
    var selected = this.tabs[this.tab_widget.currentIndex()].id
    for(var tab of this.tabs){
      if(tab.id == selected){
        this.check.setChecked(tab.is_auto_select);

        tab.post_view = true;
        this.update_post_view(tab);
      }else{
        tab.post_view = false;
      }
    }
  }

  _update_post_view(){
    for(var tab of this.tabs){
      this.update_post_view(tab);
    }
  }

  update_post_view(tab){
    if(!tab.post_view) return;

    try{
      var item = tab.timeline.get_selected_item();
    }catch{
      return;
    }

    if(!item) return;

    var id = item.id;
    var _item = this.notes[id];

    if(_item.el_type == 'Note'){
      this.post_view.set_note(_item);
    }else if(_item.el_type == 'Notification'){
      this.post_view.set_notification(_item);
    }
  }

  set_auto_select_check(check){
    this.check = check;
    var tabs = this.tabs;
    var tab_widget = this.tab_widget;
    check.addEventListener('toggled', () => {
        var selected = tabs[tab_widget.currentIndex()].id;
        for(var tab of tabs){
          if(tab.id == selected){
            tab.is_auto_select = check.isChecked();
          }
        }
    })
  }

  set_emoji_parser(parser){
    this.emoji_parser = parser;
  }

  set_desktop_notification(desktop_notification){
    this.desktop_notification = desktop_notification;
  }

  _show_mes_dialog(mes_str){
    return new Promise((resolve, reject) => {
        var mes = new message_box(mes_str, 'わかった');
        mes.onPush(() =>{
            mes.close();
            resolve(0);
        });
        mes.exec();
    })
  }

  add_timeline_filter(callback){
    this.filters.push(callback);
  }

  filter(callback){
    var selected_tab = this.tabs[this.tab_widget.currentIndex()];
    var selected_timeline = selected_tab.timeline;

    var selected_item = null;
    try{
      selected_item = selected_timeline.get_selected_item();
      selected_item = this.notes[selected_item.id];
    }catch{
      return;
    }

    callback(selected_item);
  }
}

module.exports = Timelines;
