const {
  QWidget,
  QBoxLayout,
  Direction,
  QTabWidget,
  WindowType,
  QFont,
  QIcon
} = require('@nodegui/nodegui');
const { parse } = require('twemoji-parser');

const App = require('../../index.js');
const Assets = require('../../assets.js');
const EmojiListWidget = require('./emoji_list_widget.js');
const EmojiItem = require('./emoji_item.js');

class EmojiPicker extends QWidget{
  constructor(){
    super();

    this.result = '';
    this.close_event = null;

    this.assets = new Assets('EmojiList');

    this.layout = new QBoxLayout(Direction.TopToBottom);

    this.tab_widget = new QTabWidget();

    this.setLayout(this.layout);
    this.setWindowFlag(WindowType.Window, true);
    this.setWindowTitle('絵文字ピッカー - TenCha');
    this.resize(360, 430);
    this.setMaximumSize(360, 430);
    this.setMinimumSize(360, 430);

    this.layout.setContentsMargins(5,5,5,5);
    this.layout.setSpacing(5);

    this.layout.addWidget(this.tab_widget, 1);
  }

  init(){
    this.tab_widget.setFont(new QFont(App.settings.get("font"), 9));

    for(var category of this.assets.emoji_list.categorys){
      var widget = new EmojiListWidget(category.name);
      var emojis = [];

      for(var _emoji of this.assets.emoji_list.emojis){
        if(_emoji.category != category.name) continue;
        emojis.push(this._set_emoji(_emoji, widget));
      }

      Promise.all(emojis).then((result) => {
          for(var emoji of result){
            if(!emoji) continue;
            emoji.widget.addWidget(emoji.item);
          }
      }).catch((err) => console.log(err));

      this.tab_widget.addTab(widget, new QIcon(), category.text);
    }
  }

  async _set_emoji(_emoji, widget){
    try{
      var twemojis = parse(_emoji.text);
      var emoji = await App.emoji_parser.cache.get(twemojis[0]);

      var item = new EmojiItem(emoji);
      item.addEventListener('clicked', () => {
          this.result = _emoji.text;
          this.close();
      });
      return { widget: widget, item: item };
    }catch(err){
      console.log(err);
      return;
    }
  }

  exec(){
    super.show();
  }

  close(){
    super.close();
  }

  get_result(){
    var result = this.result;
    this.result = '';
    // 消す
    this.removeEventListener('Close', this.close_event);
    // 使い終わったら忘れる
    this.close_event = null;

    return result;
  }

  setCloseEvent(callback){
    // もし既に設定されているなら拒否
    if(this.close_event) return;

    // 設定する
    this.close_event = callback;
    this.addEventListener('Close', callback);
  }
}

module.exports = EmojiPicker;
