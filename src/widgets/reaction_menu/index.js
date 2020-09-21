const {
  QMenu,
  QAction,
  QIcon,
  QSize,
  QFont
} = require('@nodegui/nodegui');
const { parse } = require('twemoji-parser');

const App = require('../../index.js');
const ReactionEmojiInputWindow = require('../reaction_emoji_input_window');

class ReactionMenu extends QMenu{
  constructor(){
    super();

    this.reactions = [];

    this.emoji_input_window = new ReactionEmojiInputWindow();

    this.code_input_action = new QAction();

    this.code_input_action.setText('絵文字を入力...');
    this.code_input_action.addEventListener('triggered', function(){
        this.emoji_input_window.exec();
      }.bind(this)
    );

    this.emoji_input_window.addEventListener('Close', function(){
        var result = this.emoji_input_window.getResult();
        if(!result) return;
        App.post_action.reaction(result);
    }.bind(this));
  }

  init(){
    this.reload();
    this.emoji_input_window.setFont(new QFont(App.settings.get('font'), 9));
  }

  clear(){
    for(var action of this.reactions) this.removeAction(action);
    this.removeAction(this.code_input_action);
  }

  _parse_mk_emojis(shortcode){
    shortcode = shortcode.replace(/:/g, '');
    return App.client.emojis.find((v) => v.name == shortcode);
  }

  async reload(){
    this.clear();

    var reactions = Array.from(App.settings.get('reaction_picker_emojis'));

    var emojis = [];
    var is_code = false;
    var shortcode = "";

    for(var emoji of reactions){
      if(emoji == ":"){
        if(!is_code){
          is_code = true;
        }else{
          is_code = false;
          emojis.push(`:${shortcode}:`);
          shortcode = '';
        }
      }else if(is_code){
        shortcode += emoji;
      }else{
        emojis.push(emoji);
      }
    }

    for(var emoji of emojis){
      var twemojis = parse(`text ${emoji} text`);
      var mk_emojis = this._parse_mk_emojis(emoji);

      var reaction_func = function(emoji){
        App.post_action.reaction(emoji);
      }.bind(this, emoji);

      var action = new QAction();
      this.addAction(action);

      if(twemojis.length > 0){
        var _emoji = await App.emoji_parser.cache.get(twemojis[0]);
        var icon = new QIcon(_emoji.filename);

        action.setIcon(icon);
      }else if(mk_emojis){
        var _emoji = await App.emoji_parser.cache.get(mk_emojis);
        var icon = new QIcon(_emoji.filename);

        action.setIcon(icon);
      }else{
        action.setText(emoji);
      }

      action.addEventListener('triggered', reaction_func);
      this.reactions.push(action);
    }

    this.addSeparator(this.code_input_action);
    this.addAction(this.code_input_action);
  }

  exec(pos){
    super.exec(pos);
  }
}

module.exports = ReactionMenu;
