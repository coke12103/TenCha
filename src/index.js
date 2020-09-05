const {
  QMainWindow,
  QLabel,
  FlexLayout,
  QWidget,
  QFont
} = require('@nodegui/nodegui');

const Assets = require('./assets.js');
const RandomEmoji = require('./tools/random_emoji/index.js');
const EmojiParser = require('./tools/emoji_parser/index.js');
const PostAction = require('./post_action.js');
const SettingsLoader = require('./tools/settings_loader/index.js');
const DesktopNotification = require('./tools/desktop_notification/index.js');
const ImageViewer = require('./tools/image_viewer/index.js');
const CustomPostWindow = require('./widgets/custom_post_window/index.js');
const Blocker = require('./blocker/index.js');
const MenuBar = require('./menubar/index.js');
const _timeline = require('./timelines/index.js');
const _post_view_area = require('./widgets/postview/index.js');
const _post_box = require('./widgets/postbox/index.js');
const Client = require('./client.js');
const client = new Client();
const UserCache = require('./tools/user_cache/index.js');
const NoteCache = require('./tools/note_cache/index.js');
const NotificationCache = require('./tools/notification_cache/index.js');

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

var menu_bar = new MenuBar();
var timeline = new _timeline();
var postViewArea = new _post_view_area();
var postbox = new _post_box();
var random_emoji = new RandomEmoji();
var emoji_parser = new EmojiParser();
var settings_loader = new SettingsLoader();
var desktop_notification = new DesktopNotification();
var image_viewer = new ImageViewer();
var custom_post_window = new CustomPostWindow();
var post_action = new PostAction();
var assets = new Assets('MainWindow');
var default_font;
var blocker = new Blocker();
var user_cache = new UserCache();
var note_cache = new NoteCache();
var notification_cache = new NotificationCache();

async function init_cha(){
  // 設定読み込みはFont指定もあるので先に
  var _setting_init = settings_loader.init();
  var _blocker_init = blocker.init();
  var _image_viewer_init = image_viewer.init();

  timeline.set_post_view(postViewArea);
  timeline.set_desktop_notification(desktop_notification);

  menu_bar.post_menu.set_postbox(postbox);
  menu_bar.post_menu.set_custom_post(custom_post_window);
  menu_bar.timeline_menu.set_post_action(post_action);

  rootViewLayout.addWidget(postViewArea);
  rootViewLayout.addWidget(timeline);
  rootViewLayout.addWidget(postbox);
  rootViewLayout.addWidget(statusLabel);

  rootView.setStyleSheet(assets.css);

  win.setMenuBar(menu_bar.get_widget());
  win.setCentralWidget(rootView);

  // 設定読み込み後にやるやつ
  await _setting_init;

  default_font = new QFont(settings_loader.font, 9);
  statusLabel.setFont(default_font);

  custom_post_window.setup();

  desktop_notification.set_is_enable(settings_loader.use_desktop_notification);

  postViewArea.set_font(settings_loader.font);

  menu_bar.set_font(settings_loader.font);

  postbox.setup(settings_loader.font, random_emoji);

  // ブロッカーの読み込み後にやるやつ
  await _blocker_init;

  timeline.add_timeline_filter(blocker.is_block.bind(blocker));

  await _image_viewer_init;

  // 始めにウインドウを出しておくと何故かプロセスが死なない
  win.show();

  client.login().then(async () => {
      postViewArea.set_host(client.host);
      await timeline.init();
      timeline.start_streaming();
      post_action.init(timeline, image_viewer, custom_post_window);
      statusLabel.setText('ログイン成功!');
  });

  global.win = win;
}

init_cha();

exports.status_label = statusLabel;
exports.client = client;
exports.random_emoji = random_emoji;
exports.settings = settings_loader;
exports.emoji_parser = emoji_parser;
exports.user_cache = user_cache;
exports.note_cache = note_cache;
exports.notification_cache = notification_cache;
exports.post_action = post_action;
