class PostAction{
  constructor(){
  }

  init(client, timelines){
    this.client = client;
    this.timelines = timelines;
  }

  renote(){
    this.timelines.filter((item) => {
        if(item.el_type == 'Notification') return;

        var data = {
          renoteId: item.id
        };
        this.client.call('notes/create',data);
    })
  }
}

module.exports = PostAction
