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

_file.load_bin = function(path){
  var file;
  if(this.exist_check(path)){
    file = fs.readFileSync(path);
  }else{
    console.log("File Not Found.: " + path);
    file = null;
  }

  return file;
}

_file.mkdir = function(dir){
  try{
    fs.mkdirSync(dir);
    return;
  }catch(err){
    throw err;
  }
}

_file.json_write = function(path, data){
  return new Promise(async (resolve, reject) => {
    try{
      fs.writeFileSync(path, JSON.stringify(data, null, " "), (err) => {
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

// なんか影響あると怖いのでSyncとして用意しておく
_file.json_write_sync = function(path, data){
  try{
    fs.writeFileSync(path, JSON.stringify(data, null, " "));
  }catch(err){
    throw err;
  }
}

_file.bin_write_sync = function(path, data){
  try{
    fs.writeFileSync(path, data);
  }catch(err){
    throw err;
  }
}

_file.bin_write = function(path, data){
  return new Promise(async (resolve, reject) => {
      try{
        fs.writeFile(path, data, (err) => {
          if(err){
            console.log(err);
            throw err;
          }
        });
      }catch(err){
        reject(err);
      }

      resolve(true);
  })
}

module.exports = _file;
