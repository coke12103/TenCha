const MainWindow = require('./main_window.js');

const RandomEmoji = require('./tools/random_emoji/index.js');
const EmojiParser = require('./tools/emoji_parser/index.js');
const PostAction = require('./post_action.js');
const Settings = require('./tools/settings/index.js');

const ImageViewer = require('./tools/image_viewer/index.js');
const CustomPostWindow = require('./widgets/custom_post_window/index.js');
const Blocker = require('./blocker/index.js');
const MenuBar = require('./menubar/index.js');

const Client = require('./client.js');
const client = new Client();
exports.client = client;

const UserCache = require('./tools/user_cache/index.js');
const NoteCache = require('./tools/note_cache/index.js');
const NotificationCache = require('./tools/notification_cache/index.js');
const SettingWindow = require('./widgets/setting_window/index.js');
const EmojiPicker = require('./widgets/emoji_picker/index.js');
const DataDirectory = require('./tools/data_directory/index.js');
const VersionParser = require('./tools/version_parser/index.js');

// ディレクトリは最初に読み込みする
// もしオプションでディレクトリが指定されているならそれを利用する
var data_directory;
if(process.argv[2] && process.argv[3] && process.argv[2] == "data-dir"){
  data_directory = new DataDirectory(process.argv[3]);
}else{
  data_directory = new DataDirectory();
}

exports.data_directory = data_directory;

var main_window = new MainWindow();
var statusLabel = main_window.status_label;
exports.status_label = statusLabel;

var random_emoji = new RandomEmoji();
exports.random_emoji = random_emoji;

var menu_bar = new MenuBar();

var emoji_parser = new EmojiParser();
exports.emoji_parser = emoji_parser;

var settings = new Settings();
exports.settings = settings;

var image_viewer = new ImageViewer();

var custom_post_window = new CustomPostWindow();
exports.custom_post_window = custom_post_window;

var post_action = new PostAction();
exports.post_action = post_action;

var blocker = new Blocker();

var user_cache = new UserCache();
var note_cache = new NoteCache();
var notification_cache = new NotificationCache();
exports.user_cache = user_cache;
exports.note_cache = note_cache;
exports.notification_cache = notification_cache;

var version_parser = new VersionParser();
exports.version_parser = version_parser;

async function init_cha(){
  // 設定読み込み後にやるやつ
  settings.init();
  blocker.init();
  image_viewer.init();

  menu_bar.post_menu.set_postbox(main_window.post_box);

  main_window.setMenuBar(menu_bar);

  main_window.setFont(settings.get('font'));
  menu_bar.setFont(settings.get('font'));

  var setting_window = new SettingWindow();
  exports.setting_window = setting_window;

  statusLabel.setText('絵文字ピッカーの設定中...');
  var emoji_picker = new EmojiPicker();
  await emoji_picker.init();
  exports.emoji_picker = emoji_picker;
  statusLabel.setText('絵文字ピッカーの設定完了');

  custom_post_window.setup();

  main_window.timeline.add_timeline_filter(blocker.is_block.bind(blocker));

  main_window.show();

  client.login().then(async () => {
      await version_parser.init();
      menu_bar.init();
      await main_window.timeline.init();
      post_action.init(main_window.timeline, image_viewer);
      statusLabel.setText('ログイン成功!');
  });

  global.win = main_window;
}

init_cha();
