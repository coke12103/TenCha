const {
  QScrollArea,
  QLabel,
  ScrollBarPolicy,
  AlignmentFlag,
  Shape,
  TextInteractionFlag
} = require("@nodegui/nodegui");

class ContentBox extends QScrollArea{
  constructor(){
    super();

    this.setObjectName("postViewContentArea");
    this.setAlignment(AlignmentFlag.AlignTop|AlignmentFlag.AlignLeft);
    this.setHorizontalScrollBarPolicy(ScrollBarPolicy.ScrollBarAsNeeded);
    this.setVerticalScrollBarPolicy(ScrollBarPolicy.ScrollBarAsNeeded);
    this.setFrameShape(Shape.NoFrame);
    this.setWidgetResizable(true);

    this.content = new QLabel();
    this.content.setObjectName('postViewBodyLabel');
    this.content.setAlignment(AlignmentFlag.AlignTop|AlignmentFlag.AlignLeft);
    this.content.setWordWrap(true);
    this.content.setTextInteractionFlags(
      TextInteractionFlag.LinksAccessibleByMouse
      | TextInteractionFlag.TextSelectableByMouse
    );
    this.content.setOpenExternalLinks(true);

    this.setWidget(this.content);
  }

  setText(text){
    this.content.setText(text);
  }

  setFont(font){
    this.content.setFont(font);
  }
}

module.exports = ContentBox;
