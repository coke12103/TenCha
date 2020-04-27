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
const RandomEmoji = require('./tools/random_emoji/index.js');
const EmojiParser = require('./tools/emoji_parser/index.js');
const PostAction = require('./post_action.js');
const SettingsLoader = require('./tools/settings_loader/index.js');
const DesktopNotification = require('./tools/desktop_notification/index.js');
const MenuBar = require('./menubar/index.js');
const _timeline = require('./timelines/index.js');
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

var menu_bar = new MenuBar();
var timeline = new _timeline();
var postViewArea = new _post_view_area();
var checkboxs = new _checkboxs();
var timeline_auto_select = checkboxs.get('timeline_auto_select');
var postbox = new _post_box();
var random_emoji = new RandomEmoji(postbox);
var emoji_parser = new EmojiParser();
var settings_loader = new SettingsLoader();
var desktop_notification = new DesktopNotification();
var post_action = new PostAction();
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
timeline.set_emoji_parser(emoji_parser);
timeline.set_desktop_notification(desktop_notification);

menu_bar.post_menu.set_random_emoji(random_emoji);
menu_bar.timeline_menu.set_post_action(post_action);

timelineControlsAreaLayout.addWidget(timeline_auto_select);

rootViewLayout.addWidget(postViewArea.get_widget());
rootViewLayout.addWidget(timeline.get_widget());
rootViewLayout.addWidget(timelineControlsArea);
rootViewLayout.addWidget(postbox.area);
rootViewLayout.addWidget(statusLabel);

rootView.setStyleSheet(assets.css);

win.setMenuBar(menu_bar.get_widget());
win.setCentralWidget(rootView);

// 始めにウインドウを出しておくと何故かプロセスが死なない
win.show();

client.login().then(async () => {
    postViewArea.set_host(client.host);
    await settings_loader.init();
    desktop_notification.set_is_enable(settings_loader.use_desktop_notification);
    await emoji_parser.init(settings_loader.use_emojis);
    await timeline.init();
    timeline.start_streaming(statusLabel, client);
    post_action.init(client, timeline);
    statusLabel.setText('ログイン成功!');
});

global.win = win;
