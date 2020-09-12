const {
  QLabel
} = require('@nodegui/nodegui');

class NoteCounter extends QLabel{
  constructor(){
    super();

    this.all = 0;
    this.current = 0;

    this.update();
  }

  setAllCount(count){
    this.all = count;
    this.update();
  }

  setCurrentCount(count){
    this.current = count;
    this.update();
  }

  update(){
    this.setText(`${this.current}/${this.all}`);
  }
}

module.exports = NoteCounter;
