const App = require('./index.js');
const DeleteConfirmWindow = require('./widgets/delete_confirm_window/index.js');

class PostAction{
  constructor(){
  }

  init(timelines, image_viewer, custom_post_window){
    this.timelines = timelines;
    this.image_viewer = image_viewer;
    this.custom_post_window = custom_post_window;
  }

  renote(){
    this.timelines.filter(async (item) => {
        if((!item) || (item.el_type == 'Notification')) return;

        var _item = item;

        if(item.is_renote) _item = item.renote;
        if(!(_item.visibility === 'public' || _item.visibility === 'home')) return;

        var data = { renoteId: _item.id };
        await App.client.call('notes/create',data);
        App.status_label.setText("Renoteしました!");
    })
  }

  quote(){
    this.timelines.filter((item) => {
        if((!item) || (item.el_type == 'Notification')) return;

        var _item = item;

        if(item.is_renote) _item = item.renote;
        if(!(_item.visibility === 'public' || _item.visibility === 'home')) return;

        this.custom_post_window.exec({ renoteId: _item.id });
    })
  }

  reply(){
    this.timelines.filter((item) => {
        if((!item) || (item.el_type == 'Notification')) return;

        var _item = item;

        if(item.is_renote) _item = item.renote;

        var opt = {
          replyId: _item.id,
          visibility: _item.visibility
        }

        if(_item.visibility === 'specified') opt.visibleUserIds = _item.visibleUserIds;

        this.custom_post_window.exec(opt);
    })
  }

  uni_renote(){
    this.timelines.filter((item) => {
        if((!item) || (item.el_type == 'Notification')) return;

        var _item = item;

        if(item.is_renote) _item = item.renote;
        if(!(_item.visibility === 'public' || _item.visibility === 'home')) return;

        var data = { renoteId: _item.id };
        App.client.call('notes/create',data);
        this.custom_post_window.exec({ renoteId: _item.id });
    })
  }

  is_image_view_ready(){
    var result = true;

    this.timelines.filter((item) => {
        if((!item) || (item.el_type == 'Notification')) result = false

        var _item = item;
        if(item.is_renote) _item = item.renote;

        if(!Object.keys(_item.files).length) result = false;
    })

    return result;
  }

  image_view(){
    this.timelines.filter((item) => {
        if((!item) || (item.el_type == 'Notification')) return;

        var _item = item;

        if(item.is_renote) _item = item.renote;

        if(!Object.keys(_item.files).length) return;

        this.image_viewer.show(_item);
    })
  }

  is_remove_ready(){
    var result = true;

    this.timelines.filter((item) => {
        if((!item) || (item.el_type == 'Notification')) result = false

        var _item = item;

        if(
          item.is_renote &&
          !(item.user.username == App.client.username && !item.user.host)
        ) _item = item.renote;

        if(!(_item.user.username == App.client.username && !_item.user.host)){
          result = false;
        }
    })

    return result;
  }

  note_remove(){
    this.timelines.filter((item) => {
        const delete_confirm_window = new DeleteConfirmWindow(item);
        delete_confirm_window.show();
    })
  }

  async _note_remove(item){
    if((!item) || (item.el_type == 'Notification')) return;

    var _item = item;

    // 自分の投稿であるかの分岐、自分のでなかった場合Renote先の処理に移る(RenoteかQuoteかは関係ない)
    if(
      item.renote &&
      !(item.user.username == App.client.username && !item.user.host)
    ) _item = item.renote;

    if(!(_item.user.username == App.client.username && !_item.user.host)) return;

    var data = { noteId: _item.id };

    try{
      await App.client.call('notes/delete',data);
      App.status_label.setText("削除しました!");
    }catch(err){
      console.log(err);
      App.status_label.setText("消せなかったかも...");
    }
  }

  reaction(emoji){
    this.timelines.filter(async (item) => {
        if((!item) || (item.el_type == 'Notification')) return;

        var _item = item;

        if(item.is_renote) _item = item.renote;

        var path = 'notes/reactions/create';
        var data = {
          noteId: item.id,
          reaction: emoji
        };

        try{
          var parse_data = App.version_parser.parse(path, data);
          path = parse_data.path;
          data = parse_data.data;

          await App.client.call(path, data);
          App.status_label.setText("リアクションしました!");
        }catch(err){
          console.log(err);
          App.status_label.setText("できなかったかも...");
        }
    })
  }

  favorite(){
    this.timelines.filter(async (item) => {
        if((!item) || (item.el_type == 'Notification')) return;

        var _item = item;

        if(item.is_renote) _item = item.renote;

        var data = { noteId: _item.id }

        try{
          await App.client.call('notes/favorites/create', data);
          App.status_label.setText("お気に入りました!");
        }catch(err){
          console.log(err);
          App.status_label.setText("お気に入れなかった...");
        }
    })
  }
}

module.exports = PostAction;
