const {
  QTabWidget,
  QIcon,
  QFont,
  QPoint
} = require('@nodegui/nodegui');
const player = require('play-sound')(opts = {});

const TabLoader = require('./tab_loader.js');
const Timeline = require('./timeline.js');
const Note = require('../notes.js');
const Notification = require('../notification.js');
const NotificationParser = require('../tools/notification_parser/index.js');
const PostMenu = require('./post_menu.js');

class Timelines{
  constructor(){
    const tabWidget = new QTabWidget();
    tabWidget.setObjectName('timelines');

    this.post_menu = new PostMenu();

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

  async init(host){
    var loader = new TabLoader();
    this.local = host;

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
    if(!tab.limit) tab.limit = 200;
    if(!tab.skin_name) tab.skin_name = 'default_skin';

    var data = {
      id: tab.id,
      name: tab.name,
      source: tab.source,
      disable_global_filter: tab.disable_global_filter,
      timeline: new Timeline(this.font, tab.limit, tab.skin_name),
      is_auto_select: true,
      post_view: false
    }

    this.tabs.push(data);

    data.timeline.tree.addEventListener('itemSelectionChanged', this._update_post_view.bind(this));
    data.timeline.set_context_menu_event_exec(this._exec_context_menu.bind(this));
    this.tab_widget.addTab(data.timeline.get_widget(), new QIcon(), data.name);
  }

  start_streaming(statusLabel, client){
    this.start_load_tl(client);
    client.connect_ws(statusLabel, this);
    this.change_tab();
  }

  async start_load_tl(client){
    var data = {
      limit: this.start_load_limit
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

          try{
            player.play(this.notification_sound);
          }catch(err){
            console.log(err);
          }

          var d_notification_text = NotificationParser.gen_desc_text(_notification, 'desktop_notification');
          this.desktop_notification.show(d_notification_text.title, d_notification_text.message);
        });
        break;
      case 'home':
      case 'local':
      case 'social':
      case 'global':
        this.add_tl_mess(body.id, body.body).then((val) => {
          if(val.is_notification) return;
          var selected = this._get_selected_tab();
          for(var tab of val.added_tab_ids){
            if(tab == selected.id){
              try{
                player.play(this.post_sound);
              }catch(err){
                console.log(err);
              }
            }
          }
        });
        break;
    }
  }

  async add_tl_mess(id, body){
    var add_result = {
      is_notification: false,
      added_tab_ids: []
    };

    for(var tab of this.tabs){
      for(var f of tab.source.from){
        if(f != id) continue;

        if(id == 'notification'){
          add_result.is_notification = true;
          var item = await this.create_notification(body, this.users);
          if(!tab.timeline.check_exist_item(item.id)){
            tab.timeline.add_notification(item);
            add_result.added_tab_ids.push(tab.id);
          }
        }else{
          var item = await this.create_note(body, this.users);

          // Timeline単位での表示チェック
          if(!this._check_timeline_show(item, tab.source.filter)) continue;
          // Globalのフィルター単位での表示チェック
          var is_display = true;

          if(!tab.disable_global_filter){
            for(var filter of this.filters){
              var result = filter(item);
              if(!result) is_display = false;
            }
          }

          if(!tab.timeline.check_exist_item(item.id) && is_display){
            tab.timeline.add_note(item);
            add_result.added_tab_ids.push(tab.id);
          }
        }

        if(tab.is_auto_select) tab.timeline.select_top_item();

        tab.timeline.fix_items();
      }
    }

    console.log(Object.keys(this.notes).length);
    this.fix_notes();

    return add_result;
  }

  _check_timeline_show(item, filter){
    if(!filter) return true;
    if(!(filter.length > 0)) return true;

    var result = true;

    for(var f of filter){
      var com = [];
      var match_reg;

      // マッチングするものを用意
      switch(f.type){
        case 'username':
          com.push(item.user.username);
          break;
        case 'acct':
          var acct = item.user.username;
          if(item.user.host){
            acct += item.user.host;
          }else{
            acct += "@" + this.local;
          }

          com.push(acct);
          break;
        case 'name':
          if(!item.user.name){
            com.push(item.user.username);
          }else{
            com.push(item.user.name);
          }
          break;
        case 'text':
          com.push(item.no_emoji_text);
          com.push(item.no_emoji_cw);
          break;
        case 'host':
          var host = item.user.host;
          if(!host) com.push(this.local);
          com.push(host);
          break;
        case 'visibility':
          com.push(item.visibility);
          break;
        case 'file_count':
          switch(f.match_type){
            case 'match':
              if(!item.files.length == parseInt(f.match)) result = false;
              break;
            case 'more':
              if(!item.files.length >= parseInt(f.match)) result = false;
              break;
            case 'under':
              if(!item.files.length <= parseInt(f.match)) result = false;
              break;
            default:
              break;
          }
          continue;
          break;
        default:
          break;
      }

      // マッチング用の正規表現の作成
      var reg_str = '';
      switch(f.match_type){
        case 'full':
          reg_str = `^${this._escape_regexp(f.match)}$`;
          break;
        case 'part':
          reg_str = this._escape_regexp(f.match);
          break;
        case 'regexp':
          reg_str = f.match;
          break;
        default:
          reg_str = `^${this._escape_regexp(f.match)}$`;
      }

      if(f.ignore_case){
        match_reg = new RegExp(reg_str, 'gi');
      }else{
        match_reg = new RegExp(reg_str, 'g');
      }

      var _match = false;
      for(var s of com){
        if(match_reg.test(s)) _match = true;
      }

      if(f.negative && _match) result = false;
      if(!f.negative && !_match) result = false;
    }

    return result;
  }

  _escape_regexp(str){
    return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
  }

  async fix_notes(){
    var notes = this.notes;
    var limit = this.cache_limit;
    var clear_count = this.cache_clear_count;
    if(Object.keys(this.notes).length < limit) return;

    var i = 0;
    for(var c = 0; c < clear_count; c++){
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
      var note = await new Note(body, user_map, this.notes, this.emoji_parser);
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
      notification = await new Notification(body, user_map, this.emoji_parser, this.notes);
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

  _get_selected_tab(){
    var selected = this.tabs[this.tab_widget.currentIndex()].id
    for(var tab of this.tabs){
      if(tab.id == selected) return tab;
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
      this.post_view.setNote(_item);
    }else if(_item.el_type == 'Notification'){
      console.log('Notification selected');
      this.post_view.setNotification(_item);
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

  setup(settings, post_action){
    this.cache_limit = settings.post_cache_limit;
    this.cache_clear_count = settings.post_cache_clear_count;
    this.start_load_limit = settings.start_load_limit;
    this.notification_sound = settings.notification_sound;
    this.post_sound = settings.post_sound;
    this.font = settings.font;
    this.tab_widget.setFont(new QFont(this.font, 9));
    this.post_menu.set_post_action(post_action);
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

  _exec_context_menu(pos){
    var selected_tab = this.tabs[this.tab_widget.currentIndex()];
    var selected_timeline = selected_tab.timeline;

    var selected_widget = null;
    try{
      var selected_item = selected_timeline.get_selected_item();
      selected_widget = selected_item.item.widget;
    }catch(err){
      console.log(err);
      return;
    }
    this.post_menu.exec(selected_widget.mapToGlobal(new QPoint(pos.x, pos.y)));
  }
}

module.exports = Timelines;
