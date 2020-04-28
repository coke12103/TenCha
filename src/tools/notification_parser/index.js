class NotificationParser{
  constructor(){}

  static gen_desc_text(notification, type){
    var text;
    switch(type){
      case 'postview':
        text = this._gen_postview_desc_text(notification);
        break;
      case 'notification_item':
        text = this._gen_notification_item_desc_text(notification);
        break;
      case 'desktop_notification':
        text = this._gen_desktop_notification_desc_text(notification);
        break
    }

    return text;
  }

  static _gen_postview_desc_text(notification){
    var desc_text;

    var text = this._parse_note_text(notification);

    switch(notification.type){
      case 'follow':
        desc_text = `フォローされています!`;
        break;
      case 'mention':
      case 'reply':
        desc_text = `言及:\n${text}`;
        break;
      case 'renote':
        var text = '';
        if(notification.note.renote.cw){
          text = text + notification.note.renote.cw;
          text = text + '\n------------CW------------\n';
          text = text + notification.note.renote.text;
        }else{
          text = text + notification.note.renote.text;
        }
        desc_text = `Renoteされました!:\n${text}`;
        break;
      case 'quote':
        desc_text = `引用Renoteされました!:\n${text}`;
        break;
      case 'reaction':
        desc_text = `${notification.reaction}でリアクションされました!:\n${text}`;
        break;
      case 'pollVote':
        desc_text = `投票しました!:\n${text}`;
        break;
      case 'receiveFollowRequest':
        desc_text = `フォローリクエストされています!`;
        break;
      case 'followRequestAccepted':
        desc_text = `フォローリクエストが許可されました!`;
        break;
    }

    return desc_text;
  }

  static _gen_notification_item_desc_text(notification){
    var result = {
      type_text: '',
      desc_text: ''
    };

    var text = '';

    if(notification.note && notification.note.cw){
      text = notification.note.cw.replace(/(\r\n|\n|\r)/gm," ");
    }else if(notification.note && notification.note.text){
      text = notification.note.text.replace(/(\r\n|\n|\r)/gm," ");
    }

    switch(notification.type){
      case 'follow':
        result.type_text = '＋'
        result.desc_text = `フォローされています!`;
        break;
      case 'mention':
      case 'reply':
        result.type_text = '言';
        result.desc_text = `言及: ${text}`;
        break;
      case 'renote':
        var text = '';
        if(notification.note.renote.cw){
          text = notification.note.renote.cw;
        }else{
          text = notification.note.renote.text;
        }
        result.type_text = '♻';
        result.desc_text = `Renoteされました!: ${text}`;
        break;
      case 'quote':
        result.type_text = '引';
        result.desc_text = `引用Renoteされました!: ${text}`;
        break;
      case 'reaction':
        result.type_text = '！';
        result.desc_text = `${notification.reaction}でリアクションされました!: ${text}`;
        break;
      case 'pollVote':
        result.type_text = '投';
        result.desc_text = `投票しました!: ${text}`;
        break;
      case 'receiveFollowRequest':
        result.type_text = '求';
        result.desc_text = `フォローリクエストされています!`;
        break;
      case 'followRequestAccepted':
        result.type_text = '可';
        result.desc_text = `フォローリクエストが許可されました!`;
        break;
    }

    return result;
  }

  static _gen_desktop_notification_desc_text(notification){
    var title, message;

    var text;
    if(notification.note && notification.note.cw){
      text = notification.note.cw.replace(/(\r\n|\n|\r)/gm," ");
    }else if(notification.note && notification.note.text){
      text = notification.note.text.replace(/(\r\n|\n|\r)/gm," ");
    }

    var description;
    if(notification.user && notification.user.description){
      description = notification.user.description.replace(/(\r\n|\n|\r)/gm," ");
    }else{
      description = '(BIOがありません)';
    }

    switch(notification.type){
      case 'follow':
        title = `${notification.user.acct}にフォローされています!`;
        message = `${description}`;
        break;
      case 'mention':
      case 'reply':
        title = `${notification.user.acct}からの言及`;
        message = `${text}`;
        break;
      case 'renote':
        var text = '';
        if(notification.note.renote.cw){
          text = notification.note.renote.cw;
        }else{
          text = notification.note.renote.text;
        }
        title = `${notification.user.acct}にRenoteされました!`;
        message = `${text}`;
        break;
      case 'quote':
        title = `${notification.user.acct}に引用Renoteされました!`;
        message = `${text}`;
        break;
      case 'reaction':
        title = `${notification.user.acct}に${notification.reaction}でリアクションされました!`;
        message = `${text}`;
        break;
      case 'pollVote':
        title = `${notification.user.acct}に投票されました!`;
        message = `${text}`;
        break;
      case 'receiveFollowRequest':
        title = `${notification.user.acct}にフォローリクエストされました!`;
        message = `${description}`;
        break;
      case 'followRequestAccepted':
        title = `${notification.user.acct}へのフォローリクエストが許可されました!`;
        message = `${description}`;
        break;
    }

    return { title: title, message: message };
  }

  static _parse_note_text(notification){
    var text = '';
    if(notification.note && notification.note.renote){
      var r_text = "RN @" + notification.note.renote.user.acct + ' ';
      if(notification.note.cw){
        text = notification.note.cw + '\n------------CW------------\n';
        text = text + notification.note.text;
      }else if(notification.note.text){
        text = notification.note.text + ' ';
      }

      if(notification.note.renote.cw){
        r_text = r_text + notification.note.renote.cw;
        r_text = r_text + '\n------------CW------------\n';
        r_text = r_text + notification.note.renote.text;
      }else{
        r_text = r_text + notification.note.renote.text;
      }

      text = text + r_text;
    }else if(notification.note){
      if(notification.note.cw){
        text = notification.note.cw + '\n------------CW------------\n';
        text = text + notification.note.text;
      }else{
        text = notification.note.text;
      }
    }

    return text;
  }
}

module.exports = NotificationParser;
