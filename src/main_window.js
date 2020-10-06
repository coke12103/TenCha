const {
  QMainWindow,
  QLabel,
  QBoxLayout,
  Direction,
  QWidget,
  QFont
} = require('@nodegui/nodegui');

const PostView = require('./widgets/postview/index.js');
const PostBox = require('./widgets/postbox/index.js');
const Timeline = require('./timelines/index.js');

class MainWindow extends QMainWindow{
  constructor(){
    super();

    this.root = new QWidget();
    this.root_layout = new QBoxLayout(Direction.TopToBottom);

    this.post_view = new PostView();
    this.timeline = new Timeline();
    this.post_box = new PostBox();

    this.status_label = new QLabel();

    this.setWindowTitle('TenCha');
    // TODO: サイズ記憶
    this.resize(460, 700);

    this.root.setObjectName('rootView');
    this.root.setLayout(this.root_layout);

    this.root_layout.setContentsMargins(5,5,5,5);
    this.root_layout.setSpacing(0);

    this.timeline.set_post_view(this.post_view);

    this.status_label.setWordWrap(true);
    this.status_label.setText('ログインチェック中...');
    this.status_label.setObjectName('statusLabel');
    this.status_label.setMinimumSize(120, 14);
    this.status_label.setMaximumSize(65535, 14);

    this.setCentralWidget(this.root);

    this.root_layout.addWidget(this.post_view);
    this.root_layout.addWidget(this.timeline, 1);
    this.root_layout.addWidget(this.post_box);
    this.root_layout.addWidget(this.status_label);
  }

  addWidget(widget, stretch = null){
    var index = (this.root_layout.count > 0)? this.root_layout.count - 1: 0;

    if(stretch) this.root_layout.insertWidget(index, widget, stretch);
    else this.root_layout.insertWidget(index, widget);
  }

  setFont(fontname){
    this.font = new QFont(fontname, 9);

    this.post_view.setFont(fontname);
    this.post_box.setup(this.font);
    this.status_label.setFont(this.font);
  }
}

module.exports = MainWindow;
