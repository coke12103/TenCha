class PostParser{
  constructor(){
  }
  parse(text){
    var break_regexp = new RegExp('\n', 'g');
    var url_regexp = new RegExp('((?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?)', 'gi');


    text = text.replace(break_regexp, '<br>');
    text = text.replace(url_regexp, '<a href="$1">$1</a>');
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
