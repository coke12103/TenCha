const {
  QLabel,
  QListWidgetItem,
  QSize,
  QWidget,
  QBoxLayout,
  Direction,
  QFont
} = require('@nodegui/nodegui');

const NotificationParser = require('../tools/notification_parser/index.js');
const FlagLabel = require('./flag_label.js');
const IconLabel = require('../widgets/icon_label/index.js');
const App = require('../index.js');

class NotificationItem extends QWidget{
  constructor(notification, a){
    super();

    this.item_height = 14;
    this.widget = this;

    this.list_item = new QListWidgetItem();
    this.font = new QFont(App.settings.get('font'), 9);

    this.layout = new QBoxLayout(Direction.LeftToRight);

    this.flag = new FlagLabel();
    this.icon = new IconLabel(this.item_height);
    this.name = new QLabel();
    this.desc = new QLabel();

    this.setLayout(this.layout);

    this.layout.setContentsMargins(2,0,0,1);
    this.layout.setSpacing(6);

    this.list_item.setSizeHint(new QSize(1200, 15));

    this.name.setFixedSize(120, this.item_height);

    this.name.setFont(this.font);
    this.desc.setFont(this.font);

    this.layout.addWidget(this.flag);
    this.layout.addWidget(this.icon);
    this.layout.addWidget(this.name);
    this.layout.addWidget(this.desc, 1);

    this.setNotification(notification);
  }

  setNotification(notification){
    var text = NotificationParser.gen_desc_text(notification, 'notification_item');

    this.flag.setFlag(notification.type);
    this.icon.setPixmap(notification.user.avater);
    this.name.setText(notification.user.acct);
    this.desc.setText(text);
  }

  destroy(){
    this.layout.removeWidget(this.flag);
    this.layout.removeWidget(this.name);
    this.layout.removeWidget(this.icon);
    this.layout.removeWidget(this.desc);

    this.flag.close();
    this.name.close();
    this.icon.close();
    this.desc.close();

    this.close();

    this.list_item = undefined;
    this.widget = undefined;
    this.font = undefined;
    this.item_height = undefined;
    this.layout = undefined;
    this.flag = undefined;
    this.icon = undefined;
    this.name = undefined;
    this.desc = undefined;
  }
}

module.exports = NotificationItem;
