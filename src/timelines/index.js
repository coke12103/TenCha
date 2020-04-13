const {
  QTabWidget,
  QIcon,
  QFont
} = require('@nodegui/nodegui');

const TabLoader = require('./tab_loader.js');
const Timeline = require('./timeline.js');

class Timelines{
  constructor(){
    const font = new QFont('sans', 9);
    const tabWidget = new QTabWidget();
    tabWidget.setObjectName('timelines');
    tabWidget.setFont(font);

    this.tab_widget = tabWidget;
    this.tabs = [];
    this.users = {};
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
      is_auto_select: false
    }

    this.tabs.push(data);

    this.tab_widget.addTab(data.timeline.get_widget(), new QIcon(), data.name);
  }

  start_streaming(statusLabel, client){
    client.connect_ws(statusLabel, this);
    this.change_tab();
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
      case 'home':
      case 'local':
      case 'social':
      case 'global':
        this.add_tl_mess(body.id, body);
        break;
    }

  }

  add_tl_mess(id, body){
    for(var tab of this.tabs){
      if(tab.source == id){
        if(tab.source == 'notification'){
          tab.timeline.add_notification(body, this.users);
        }else{
          tab.timeline.add_note(body, this.users);
        }
      }
    }
  }

  set_post_view(view){
    this.post_view = view;
    this.tab_widget.addEventListener('currentChanged', this.change_tab.bind(this));
  }

  change_tab(){
    var selected = this.tabs[this.tab_widget.currentIndex()].id
    for(var tab of this.tabs){
      if(tab.id == selected){
        tab.timeline.set_auto_select(tab.is_auto_select);
        this.check.setChecked(tab.is_auto_select);

        tab.timeline.set_post_view(this.post_view);
        tab.timeline.update_post_view();
      }else{
        tab.timeline.set_post_view(null);
      }
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
          tab.timeline.set_auto_select(tab.is_auto_select);
        }
    })
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
    }catch{
    }

    callback(selected_item);
  }
}

module.exports = Timelines;
