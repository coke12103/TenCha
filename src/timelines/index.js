const {
  QTabWidget,
  QWidget,
  QBoxLayout,
  Direction,
  QIcon,
  QFont,
  QPoint,
  QCheckBox
} = require('@nodegui/nodegui');
const player = require('play-sound')(opts = {});

const TabLoader = require('./tab_loader.js');
const Timeline = require('./timeline.js');
const NotificationParser = require('../tools/notification_parser/index.js');
const PostMenu = require('./post_menu.js');
const App = require('../index.js');

class Timelines extends QWidget{
  constructor(){
    super();

    this.post_menu = new PostMenu();

    this.tabs = [];
    this.sources = [];
    this.filters = [];

    this.layout = new QBoxLayout(Direction.TopToBottom);

    this.tab_widget = new QTabWidget();
    this.auto_select_check = new QCheckBox();

    this.setLayout(this.layout);

    this.setObjectName('timelineBox');

    this.layout.setContentsMargins(0,0,0,0);
    this.layout.setSpacing(5);

    this.tab_widget.setObjectName('timelines');

    this.auto_select_check.setObjectName('timelineAutoSelect');
    this.auto_select_check.setText('最新の投稿を追う');

    this.layout.addWidget(this.tab_widget, 1);
    this.layout.addWidget(this.auto_select_check);

    this.auto_select_check.addEventListener('toggled', () => {
        this.tabs[this.tab_widget.currentIndex()].is_auto_select = this.auto_select_check.isChecked();
    })
  }

  async init(){
    try{
      var loader = new TabLoader();
      var tabs = loader.tabs;
    }catch(err){
      console.log(err);
      await this._show_mes_dialog('タブのロードに失敗しました!\ntabs.jsonを削除するか自力で直してください!');
      process.exit(1);
    }

    for(var tab of tabs) this.setTimeline(tab);

    this.tab_widget.setFont(new QFont(App.settings.get("font"), 9));
    this.auto_select_check.setFont(new QFont(App.settings.get("font"), 9));
  }

  setTimeline(tab){
    if(!tab.limit) tab.limit = App.settings.get("default_timeline_limit");
    if(!tab.skin_name) tab.skin_name = 'default_skin';

    var data = {
      id: tab.id,
      name: tab.name,
      source: tab.source,
      disable_global_filter: tab.disable_global_filter,
      item: new Timeline(
        tab.id,
        tab.limit,
        tab.skin_name,
        this._exec_context_menu.bind(this)
      ),
      is_auto_select: true,
      post_view: false
    }

    this.tabs.push(data);

    data.item.addEventListener('itemSelectionChanged', this._update_post_view_all.bind(this));
    this.tab_widget.addTab(data.item, new QIcon(), data.name);

    // 利用されているソースの一覧を記憶
    Array.prototype.push.apply(this.sources, data.source.from);
    this.source = this.sources.filter((x, i, self) => { return self.indexOf(x) === i; } );
  }

  start_streaming(){
    this.start_load_tl();
    App.client.connect_ws(this);
    this.change_tab();
  }

  async start_load_tl(){
    var data = { limit: App.settings.get("start_load_limit") };

    var calls = [
      { source: 'global',       call: 'notes/global-timeline' },
      { source: 'social',       call: 'notes/hybrid-timeline' },
      { source: 'local',        call: 'notes/local-timeline'  },
      { source: 'home',         call: 'notes/timeline'        },
      { source: 'notification', call: 'i/notifications'       }
    ];

    for(var c of calls){
      var posts = await App.client.call(c.call, data);
      for(var note of posts){
        this.addItem(c.source, note);
      }
    }
  }

  async onMess(data){
    try{
      data = JSON.parse(data);
    }catch(err){
      console.log(err);
      return;
    }
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
        await this.addItem(body.id, body.body);
        var notification = App.notification_cache.find_id(body.body.id);
        if(!notification) return;

        // 通知音
        try{
          player.play(App.settings.get("notification_sound"));
        }catch(err){
          console.log(err);
        }

        // デスクトップ通知
        var d_notification_text = NotificationParser.gen_desc_text(notification, 'desktop_notification');
        this.desktop_notification.show(d_notification_text.title, d_notification_text.message);
        break;
      case 'home':
      case 'local':
      case 'social':
      case 'global':
        var result = await this.addItem(body.id, body.body);
        if(result.is_notification) return;

        // 選択されているタブだったら投稿が来た時の音
        var selected = this.tabs[this.tab_widget.currentIndex()].id
        var is_add_selected = result.added_tab_ids.some((v) => { return v == selected });

        if(is_add_selected){
          try{
            player.play(App.settings.get("post_sound"));
          }catch(err){
            console.log(err);
          }
        }

        break;
    }
  }

  async addItem(source_id, body){
    var result = {
      is_notification: false,
      added_tab_ids: []
    };
    if(source_id == 'notification') result.is_notification = true;

    // 現在存在するタブのどれかにこのソースを利用するタブがあるか(なければ追加する投稿がないのでreturn)
    if(!this.sources.some((v) => v == source_id)) return result;

    // アイテムを先に作る
    var item;

    if(source_id == 'notification'){
      try{
        item = await App.notification_cache.get(body);
      }catch(err){
        console.log(err);
        return;
      }

      // Notification は実際に通知しない内容もありその場合はnullが返ってくるのでreturn
      if(!item) return result;
    }else{
      try{
        item = await App.note_cache.get(body);
      }catch(err){
        console.log(err);
        return;
      }
    }

    // タブの数だけループ
    for(var tab of this.tabs){
      for(var from of tab.source.from){
        if(from != source_id) continue;
        if(tab.item.check_exist_item(item.id)) continue;

        if(source_id == 'notification'){
          tab.item.addNotification(item);
          tab.item.fix_items();
        }else{
          // Timeline単位での表示チェック
          if(!this._check_timeline_show(item, tab.source.filter)) continue;
          // Globalのフィルター単位での表示チェック
          var is_display = true;

          if(!tab.disable_global_filter){
            for(var filter of this.filters){
              var filter_result = filter(item);
              if(!filter_result) is_display = false;
            }
          }

          if(!is_display) continue;

          App.note_cache.use(item.id, tab.id);
          tab.item.addNote(item);
        }

        // 追加後に処理する諸々
        result.added_tab_ids.push(tab.id);
        if(tab.is_auto_select) tab.item.select_top_item();
      }
    }

    return result;
  }

  _check_timeline_show(item, filter){
    if(!filter || !(filter.length > 0)) return true;

    var result = true;

    for(var f of filter){
      var com = [];
      var match_reg;

      switch(f.type){
        case 'username':
          com.push(item.user.username);
          break;
        case 'acct':
          var acct = item.user.acct;
          if(!item.user.host) acct += `@${App.client.host}`;

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
          // TODO: no_emoji_textやno_emoji_cwを廃止したい
          com.push(item.no_emoji_text);
          com.push(item.no_emoji_cw);
          break;
        case 'host':
          var host = item.user.host;
          if(!host) host = App.client.host;
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
          break;
        default:
          break;
        }

        // file_countはこの時点で処理終わってるので抜ける
        if(f.type == 'file_count') continue;

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
      for(var s of com) if(match_reg.test(s)) _match = true;

      if((f.negative && _match) || (!f.negative && !_match)) result = false;
    }

    return result;
  }

  _escape_regexp(str){
    return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
  }

  set_post_view(view){
    this.post_view = view;
    this.tab_widget.addEventListener('currentChanged', this.change_tab.bind(this));
  }

  change_tab(){
    var selected = this.tabs[this.tab_widget.currentIndex()].id;

    for(var tab of this.tabs){
      if(tab.id == selected){
        this.auto_select_check.setChecked(tab.is_auto_select);

        tab.post_view = true;
        this.update_post_view(tab);
      }else{
        tab.post_view = false;
      }
    }
  }

  _update_post_view_all(){
    for(var tab of this.tabs){
      this.update_post_view(tab);
    }
  }

  update_post_view(tab){
    if(!tab.post_view) return;

    try{
      var item = tab.item.get_selected_item();
    }catch{
      return;
    }
    if(!item) return;

    // Noteを参照してなければnotificationを参照する
    var note = App.note_cache.find_id(item.id);
    if(!note) var notification = App.notification_cache.find_id(item.id);
    if(!note && !notification) return;

    if(note){
      this.post_view.setNote(note);
    }else{
      this.post_view.setNotification(notification);
    }
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
    var selected_timeline = selected_tab.item;

    var selected_item = null;
    try{
      var selected = selected_timeline.get_selected_item();
      selected_item = App.note_cache.find_id(selected.id);
      if(!selected_item) selected_item = App.notification_cache.find_id(selected.id);
      if(!selected_item) selected_item = null;
    }catch{
      return;
    }

    callback(selected_item);
  }

  _exec_context_menu(pos){
    var selected_timeline = this.tabs[this.tab_widget.currentIndex()].item;

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
