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
  quote(){
    this.timelines.filter((item) => {
        if(!item) return;
        if(item.el_type == 'Notification') return;

        var item_id = item.id;

        if(item.renote && (!item.no_emoji_text && !item.no_emoji_cw)) item_id = item.renote.id;
        if(!(item.visibility === 'public' || item.visibility === 'home')) return;

        this.custom_post_window.show({ renoteId: item_id });
    })
  }
}

module.exports = PostAction;
