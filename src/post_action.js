class PostAction{
  constructor(){
  }

  init(client, timelines, image_viewer, custom_post_window){
    this.client = client;
    this.timelines = timelines;
    this.image_viewer = image_viewer;
    this.custom_post_window = custom_post_window;
  }

  renote(){
    this.timelines.filter((item) => {
        if(!item) return;
        if(item.el_type == 'Notification') return;

        var item_id = item.id;

        if(item.renote && (!item.no_emoji_text && !item.no_emoji_cw)) item_id = item.renote.id;
        if(!(item.visibility === 'public' || item.visibility === 'home')) return;

        var data = {
          renoteId: item_id
        };
        this.client.call('notes/create',data);
    })
  }

  quote(){
    this.timelines.filter((item) => {
        if(!item) return;
        if(item.el_type == 'Notification') return;

        var item_id = item.id;

        if(item.renote && (!item.no_emoji_text && !item.no_emoji_cw)) item_id = item.renote.id;
        if(!(item.visibility === 'public' || item.visibility === 'home')) return;

        this.custom_post_window.exec({ renoteId: item_id });
    })
  }
  reply(){
    this.timelines.filter((item) => {
        if(!item) return;
        if(item.el_type == 'Notification') return;

        var _item = item;
        if(item.renote && (!item.no_emoji_text && !item.no_emoji_cw)) _item = item.renote;

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
        if(!item) return;
        if(item.el_type == 'Notification') return;

        var item_id = item.id;

        if(item.renote && (!item.no_emoji_text && !item.no_emoji_cw)) item_id = item.renote.id;
        if(!(item.visibility === 'public' || item.visibility === 'home')) return;

        var data = {
          renoteId: item_id
        };
        this.client.call('notes/create',data);
        this.custom_post_window.exec({ renoteId: item_id });
    })
  }

  is_image_view_ready(){
    var result = true;

    this.timelines.filter((item) => {
        if((!item) || (item.el_type == 'Notification')){
          result = false
        }

        var _item = item;

        if(
          item.renote &&
          !item.no_emoji_text &&
          !item.no_emoji_cw &&
          !Object.keys(item.files).length
        ) _item = item.renote;

        if(!Object.keys(_item.files).length){
          result = false;
        }
    })

    return result;
  }

  image_view(){
    this.timelines.filter((item) => {
        if(!item) return;
        if(item.el_type == 'Notification') return;

        var _item = item;

        if(item.renote && !item.no_emoji_text && !item.no_emoji_cw && !Object.keys(item.files).length) _item = item.renote;

        if(!Object.keys(_item.files).length) return;

        this.image_viewer.show(_item);
    })
  }

  is_remove_ready(){
    var result = true;

    this.timelines.filter((item) => {
        if((!item) || (item.el_type == 'Notification')){
          result = false
        }

        var _item = item;

        if(
          item.renote &&
          !(item.user.username == this.client.username && !item.user.host)
        ) _item = item.renote;

        if(!(_item.user.username == this.client.username && !_item.user.host)){
          result = false;
        }
    })

    return result;
  }

  note_remove(){
    this.timelines.filter((item) => {
        if((!item) || (item.el_type == 'Notification')){
          return;
        }

        var _item = item;

        if(
          item.renote &&
          !(item.user.username == this.client.username && !item.user.host)
        ) _item = item.renote;

        if(!(_item.user.username == this.client.username && !_item.user.host)) return;

        var data = {
          noteId: _item.id
        };
        this.client.call('notes/delete',data);
    })

  }
}

module.exports = PostAction;
