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
const ImageViewer = require('./tools/image_viewer/index.js');
const Blocker = require('./blocker/index.js');
const MenuBar = require('./menubar/index.js');
const _timeline = require('./timelines/index.js');
const _checkboxs = require('./checkboxs.js');
const _post_view_area = require('./postview.js');
const _post_box = require('./postbox/index.js');
const Client = require('./client.js');
const client = new Client();

const win = new QMainWindow();
win.setWindowTitle('TenCha');
win.resize(460, 700);

const rootView = new QWidget();
const rootViewLayout = new FlexLayout();
rootView.setObjectName('rootView');
rootView.setLayout(rootViewLayout);

const statusLabel = new QLabel();
statusLabel.setWordWrap(true);
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
var image_viewer = new ImageViewer();
var post_action = new PostAction();
var assets = new Assets('MainWindow');
var default_font;
var blocker = new Blocker();

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

async function init_cha(){
  // 設定読み込みはFont指定もあるので先に
  var _setting_init = settings_loader.init();
  var _blocker_init = blocker.init();
  var _image_viewer_init = image_viewer.init();

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

  // 設定読み込み後にやるやつ
  await _setting_init;

  default_font = new QFont(settings_loader.font, 9);
  statusLabel.setFont(default_font);

  desktop_notification.set_is_enable(settings_loader.use_desktop_notification);

  timeline.set_settings(settings_loader);
  postViewArea.set_font(settings_loader.font);
  postbox.set_font(settings_loader.font);
  menu_bar.set_font(settings_loader.font);
  checkboxs.set_font(settings_loader.font);

  // ブロッカーの読み込み後にやるやつ
  await _blocker_init;

  timeline.add_timeline_filter(blocker.is_block.bind(blocker));

  await _image_viewer_init;

  // 始めにウインドウを出しておくと何故かプロセスが死なない
  win.show();

  // ウィジェットサイズだとバグってることあるのでウインドウサイズをもぎ取るためにウインドウを渡す
  postViewArea.set_main_win(win);

  client.login().then(async () => {
      await emoji_parser.init(settings_loader.use_emojis);
      postViewArea.set_host(client.host);
      await timeline.init();
      timeline.start_streaming(statusLabel, client);
      post_action.init(client, timeline, image_viewer);
      statusLabel.setText('ログイン成功!');
  });

  global.win = win;
}

init_cha();

