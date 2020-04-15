class PostParser{
  constructor(){
  }
  parse(text){
    var break_regexp = new RegExp('\n', 'g');
    var url_regexp = /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/gi;


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
