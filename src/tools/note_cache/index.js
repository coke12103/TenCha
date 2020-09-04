const Note = require('../../models/note.js');
const App = require('../../index.js');

class NoteCache{
  constructor(){
    this.notes = {};
    this.isRemoveRun = false;
  }

  async get(note){
    // noteが自分のキャッシュにあるなら整形済みのそれを返す
    if(this.notes[note.id]){
      // TODO: Update
      this.notes[note.id].update(note);
    }else{
      // なければ作る
      try{
        this.notes[note.id] = await new Note(note);
      }catch(err){
        throw err;
      }

      this.remove_cache();
    }

    console.log(Object.keys(this.notes).length);
    return this.notes[note.id];
  }

  find_id(id){
    var result = null;

    if(this.notes[id]) result = this.notes[id];

    return result;
  }

  use(id, tl){
    if(this.notes[id]) {
      this.notes[id].use_tl[tl] = true;
    }else{
      console.log("ない")
    }
  }

  free(id, tl){
    if(this.notes[id]) delete this.notes[id].use_tl[tl];
  }

  remove_cache(){
    if(this.isRemoveRun) return;

    var limit = App.settings.post_cache_limit;
    if(Object.keys(this.notes).length < limit) return;

    this.isRemoveRun = true;

    var clear_count = App.settings.post_cache_clear_count;

    for(var i = 0; i < clear_count; i++){
      var noteid = Object.keys(this.notes)[i];
      if(!Object.keys(this.notes[noteid].use_tl).length < 1) continue;

      this._remove_note(noteid);
    }

    console.log('clear');

    this.isRemoveRun = false;
  }

  _remove_note(noteid){
    this.notes[noteid].purge();
    console.log('removeing: ' + this.notes[noteid].id);
    delete this.notes[noteid];
  }
}

module.exports = NoteCache;
