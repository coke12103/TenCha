const fs = require('fs');

var _file = {};

_file.exist_check = function(path){
  var exist = false;
  try{
    fs.statSync(path);
    exist = true;
  }catch(err){
    exist = false;
  }

  return exist;
}

_file.load = function(path){
  var file;
  if(this.exist_check(path)){
    file = fs.readFileSync(path, 'utf8');
  }else{
    console.log("File Not Found.: " + path);
    file = null;
  }

  return file;
}

_file.json_write = function(path, data){
  return new Promise(async (resolve, reject) => {
    try{
      fs.writeFileSync(path, JSON.stringify(data), (err) => {
        if(err){
          console.log(err);
          throw err;
        }
      });
    }catch(err){
      reject(err);
    }

    resolve(true);
  });
}

module.exports = _file;
