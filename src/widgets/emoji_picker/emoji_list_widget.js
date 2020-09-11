const {
  QWidget,
  QGridLayout,
  QScrollArea
} = require('@nodegui/nodegui');

class EmojiListWidget extends QScrollArea{
  constructor(category){
    super();

    this.count = 0;
    this.max_col = 8;
    this.category = category;

    this.widget = new QWidget();
    this.layout = new QGridLayout();

    this.widget.setLayout(this.layout);
    this.setWidget(this.widget);
  }

  addWidget(widget){
    var row = this.count / this.max_col;
    var col = this.count % this.max_col;

    this.layout.addWidget(widget, row, col);
    this.count++;
  }
}

module.exports = EmojiListWidget;
