const {
  QLabel,
  QListWidgetItem,
  QSize,
  QWidget,
  FlexLayout,
  QFont,
} = require('@nodegui/nodegui');

const NotificationParser = require('../tools/notification_parser/index.js');

class NotificationItem{
  constructor(notification, font){
    const list_item = new QListWidgetItem();
    const widget = new QWidget();
    const widget_layout = new FlexLayout();
    widget.setLayout(widget_layout);
    widget.setFlexNodeSizeControlled(false);

    const type_label = new QLabel();
    const icon_label = new QLabel();
    const name_label = new QLabel();
    const desc_label = new QLabel();

    const item_height = 14;

    type_label.setInlineStyle(`
      flex-grow: 1;
      width: 24px;
      margin-right: 2px;
    `);
    icon_label.setInlineStyle(`
      flex-grow: 1;
      width: ${item_height - 1}px;
    `);
    name_label.setInlineStyle(`
      flex-grow: 1;
      margin-right: 5px;
      width: 120px;
    `);

    desc_label.setInlineStyle(`flex-grow: 3;`);

    list_item.setSizeHint(new QSize(1200, 15));
    type_label.setFixedSize(24, item_height);
    icon_label.setFixedSize(item_height -1, item_height -1);
    name_label.setFixedSize(120, item_height);

    var f = new QFont(font, 9);
    desc_label.setFont(f);
    name_label.setFont(f);
    type_label.setText(f);

    widget_layout.addWidget(type_label);
    widget_layout.addWidget(icon_label);
    widget_layout.addWidget(name_label);
    widget_layout.addWidget(desc_label);

    var type = NotificationParser.gen_desc_text(notification, 'notification_item');

    type_label.setText(type.type_text);
    name_label.setText(notification.user.acct);
    desc_label.setText(type.desc_text);

    widget.setInlineStyle(`
      height: ${item_height}px;
      justify-content: flex-start;
      flex-direction: row;
    `);

    if(notification.user.avater){
      var s = icon_label.size();
      var w = s.width();
      var h = s.height();
      var icon = notification.user.avater.scaled(w, h);
      icon_label.setPixmap(icon);
    }else{
      icon_label.setText("  ");
    }

    this.list_item = list_item;
    this.widget = widget;
    this.widget_layout = widget_layout;
    this.type_label = type_label;
    this.icon_label = icon_label;
    this.name_label = name_label;
    this.desc_label = desc_label;
  }

  destroy(){
    this.widget_layout.removeWidget(this.desc_label);
    this.widget_layout.removeWidget(this.name_label);
    this.widget_layout.removeWidget(this.icon_label);
    this.widget_layout.removeWidget(this.type_label);

    this.desc_label.close();
    this.name_label.close();
    this.icon_label.close();
    this.type_label.close();

    this.widget.close();

    this.list_item = undefined;
    this.widget = undefined;
    this.widget_layout = undefined;
    this.type_label = undefined;
    this.icon_label = undefined;
    this.name_label = undefined;
    this.desc_label = undefined;
  }
}

module.exports = NotificationItem;
