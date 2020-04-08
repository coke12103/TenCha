const request = require("request-promise");
const {
  QMainWindow,
  QLabel,
  FlexLayout,
  QWidget,
  QApplication,
  QFont
} = require('@nodegui/nodegui');

const file = require('./file.js');
const Assets = require('./assets.js');
const _timeline = require('./timeline.js');
const _checkboxs = require('./checkboxs.js');
const _post_view_area = require('./postview.js');
const _post_box = require('./postbox/index.js');
const Client = require('./client.js');
const client = new Client();
const default_font = new QFont('sans', 9);

const win = new QMainWindow();
win.setWindowTitle('TenCha');
win.resize(460, 700);

const rootView = new QWidget();
const rootViewLayout = new FlexLayout();
rootView.setObjectName('rootView');
rootView.setLayout(rootViewLayout);

const statusLabel = new QLabel();
statusLabel.setWordWrap(true);
statusLabel.setFont(default_font);
statusLabel.setText('ログインチェック中...');
statusLabel.setObjectName('statusLabel');

const timelineControlsArea = new QWidget();
const timelineControlsAreaLayout = new FlexLayout();
timelineControlsArea.setObjectName('timelineControlsArea');
timelineControlsArea.setLayout(timelineControlsAreaLayout);

var timeline = new _timeline();
var postViewArea = new _post_view_area();
var checkboxs = new _checkboxs();
var timeline_auto_select = checkboxs.get('timeline_auto_select');
var postbox = new _post_box();
var assets = new Assets('MainWindow');

postbox.add_event_listener(async () => {
    var data = postbox.get_data();
    console.log(data)
    if(!data.text){
      statusLabel.setText('本文を入れてね');
      return;
    }

    statusLabel.setText('投稿中...');
    try{
      await client.call('notes/create', data);
      postbox.clear();
      statusLabel.setText('投稿成功!');
    }catch(err){
      console.log(err);
      statusLabel.setText(err.error.error.message);
    }
})

timeline.set_auto_select_check(timeline_auto_select);
timeline.set_post_view(postViewArea);

timelineControlsAreaLayout.addWidget(timeline_auto_select);

rootViewLayout.addWidget(postViewArea.get_widget());
rootViewLayout.addWidget(timeline.get_widget());
rootViewLayout.addWidget(timelineControlsArea);
rootViewLayout.addWidget(postbox.area);
rootViewLayout.addWidget(statusLabel);

rootView.setStyleSheet(assets.css);

win.setCentralWidget(rootView);

// 始めにウインドウを出しておくと何故かプロセスが死なない
win.show();

client.login().then(() => {
    timeline.start_streaming(statusLabel, client);
    statusLabel.setText('ログイン成功!');
});

global.win = win;
