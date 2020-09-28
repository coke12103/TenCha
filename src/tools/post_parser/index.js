class PostParser{
  constructor(){
  }
  parse(text){
    var break_regexp = new RegExp('\n', 'g');
    var url_regexp = /(?<!^search\:\/\/)((?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?)/gi;
    var search_regexp = /((?:(?:search):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?) \[(.*)\]/gi;

    if(url_regexp.test(text)){
      var _r = '';
      for(var _t of text.split('\n')){
        _t = _t.replace(url_regexp, '<a href="$1">$1</a>');

        _r += _t + "\n";
      }
      text = _r;
    }

    if(search_regexp.test(text)){
      var _r = '';
      for(var _t of text.split('\n')){
        _t = _t.replace(search_regexp, '<a href="$1">$2</a>');
        _t = _t.replace("search://", 'https://');
        _t = _t.replace("<%3A>", ":");

        _r += _t + "\n";
      }
      text = _r;
    }

    text = text.replace(/\n+$/,"").replace(break_regexp, '<br>');

    text = '<html>' + text + '</html>';

    return text;
  }
  static escape_html(text){
//    text = text.replace(/&/g, '&amp;');
    text = text.replace(/>/g, '&gt;');
    text = text.replace(/</g, '&lt;');
//    text = text.replace(/"/g, '&quot;');
//    text = text.replace(/'/g, '&#x27;');
//    text = text.replace(/`/g, '&#x60;');

    return text;
  }
}

module.exports = PostParser;
