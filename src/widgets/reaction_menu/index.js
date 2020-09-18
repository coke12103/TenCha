const {
  QMenu,
  QAction,
  QIcon,
  QSize
} = require('@nodegui/nodegui');
const { parse } = require('twemoji-parser');

const App = require('../../index.js');

class ReactionMenu extends QMenu{
  constructor(){
    super();

    this.reactions = [];

    for(var i = 0; i < 10; i++){
      var action = new QAction();
      this.addAction(action);

      this.reactions.push(action);
    }

    this.code_input_action = new QAction();

    this.code_input_action.setText('絵文字を入力...');

    this.addSeparator(this.code_input_action);
    this.addAction(this.code_input_action);
  }

  init(){
    this.reload();
  }

  clear(){
  }

  async reload(){
    var reactions = Array.from(App.settings.get('reaction_picker_emojis'));

    for(var i = 0; i < 10; i++){
      var twemojis = parse(`text ${reactions[i]} text`);

      var reaction_func = function(reactions, i){
        App.post_action.reaction(reactions[i]);
      }.bind(this, reactions, i);

      if(!twemojis){
        this.reactions[i].setText(reactions[i]);
      }else{
        var emoji = await App.emoji_parser.cache.get(twemojis[0]);
        var icon = new QIcon(emoji.filename);
        this.reactions[i].setIcon(icon);
      }

      this.reactions[i].addEventListener('triggered', reaction_func);
    }
  }

  exec(pos){
    super.exec(pos);
  }
}

module.exports = ReactionMenu;
