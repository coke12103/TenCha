const MainWindow = require('./main_window.js');

const RandomEmoji = require('./tools/random_emoji/index.js');
const EmojiParser = require('./tools/emoji_parser/index.js');
const PostAction = require('./post_action.js');
const Settings = require('./tools/settings/index.js');
const DesktopNotification = require('./tools/desktop_notification/index.js');
const ImageViewer = require('./tools/image_viewer/index.js');
const CustomPostWindow = require('./widgets/custom_post_window/index.js');
const Blocker = require('./blocker/index.js');
const MenuBar = require('./menubar/index.js');
const Client = require('./client.js');
const client = new Client();
const UserCache = require('./tools/user_cache/index.js');
const NoteCache = require('./tools/note_cache/index.js');
const NotificationCache = require('./tools/notification_cache/index.js');
const SettingWindow = require('./widgets/setting_window/index.js');
const EmojiPicker = require('./widgets/emoji_picker/index.js');
const DataDirectory = require('./tools/data_directory/index.js');
const VersionParser = require('./tools/version_parser/index.js');

// ディレクトリは最初に読み込みする
var data_directory = new DataDirectory();
exports.data_directory = data_directory;

var main_window = new MainWindow();
var statusLabel = main_window.status_label;

var menu_bar = new MenuBar();

var random_emoji = new RandomEmoji();
var emoji_parser = new EmojiParser();
var settings = new Settings();
var desktop_notification = new DesktopNotification();
var image_viewer = new ImageViewer();
var custom_post_window = new CustomPostWindow();
var post_action = new PostAction();
var blocker = new Blocker();
var user_cache = new UserCache();
var note_cache = new NoteCache();
var notification_cache = new NotificationCache();
var version_parser = new VersionParser();

async function init_cha(){
  // 設定読み込みはFont指定もあるので先に
  var _setting_init = settings.init();
  var _blocker_init = blocker.init();

  image_viewer.init();

  main_window.timeline.set_desktop_notification(desktop_notification);

  menu_bar.post_menu.set_postbox(main_window.post_box);
  menu_bar.post_menu.set_custom_post(custom_post_window);

  main_window.setMenuBar(menu_bar.get_widget());

  // 設定読み込み後にやるやつ
  await _setting_init;

  main_window.setFont(settings.get('font'));

  var setting_window = new SettingWindow();
  exports.setting_window = setting_window;

  statusLabel.setText('絵文字ピッカーの設定中...');
  var emoji_picker = new EmojiPicker();
  await emoji_picker.init();
  exports.emoji_picker = emoji_picker;
  statusLabel.setText('絵文字ピッカーの設定完了');

  custom_post_window.setup();

  menu_bar.set_font(settings.get("font"));

  // ブロッカーの読み込み後にやるやつ
  await _blocker_init;

  main_window.timeline.add_timeline_filter(blocker.is_block.bind(blocker));

  main_window.show();

  client.login().then(async () => {
      await version_parser.init();
      menu_bar.init();
      await main_window.timeline.init();
      main_window.timeline.start_streaming();
      post_action.init(main_window.timeline, image_viewer, custom_post_window);
      statusLabel.setText('ログイン成功!');
  });

  global.win = main_window;
}

init_cha();

exports.status_label = statusLabel;
exports.client = client;
exports.random_emoji = random_emoji;
exports.settings = settings;
exports.emoji_parser = emoji_parser;
exports.user_cache = user_cache;
exports.note_cache = note_cache;
exports.notification_cache = notification_cache;
exports.post_action = post_action;
exports.version_parser = version_parser;
exports.custom_post_window = custom_post_window;
