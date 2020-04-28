class PostAction{
  constructor(){
  }

  init(client, timelines){
    this.client = client;
    this.timelines = timelines;
  }

  renote(){
    this.timelines.filter((item) => {
        if(!item) return;
        if(item.el_type == 'Notification') return;

        var item_id = item.id;

        if(item.renote && (!item.no_emoji_text && !item.no_emoji_cw)) item_id = item.renote.id;

        var data = {
          renoteId: item_id
        };
        this.client.call('notes/create',data);
    })
  }
}

module.exports = PostAction
