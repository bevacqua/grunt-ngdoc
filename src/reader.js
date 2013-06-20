var ngdoc = require('./ngdoc.js'),
    NEW_LINE = /\n\r?/;

module.exports = function(){
  var cache = [];

  function process(content, file, section, options) {
    if (/\.js$/.test(file)) {
      processJsFile(content, file, section).forEach(function(doc) {
        cache.push(doc);
      });
    } else if (file.match(/\.ngdoc$/)) {
      var header = '@section ' + section + '\n';
      cache.push(new ngdoc.Doc(header + content.toString(),file, 1, options).parse());
    }
  }

  function processJsFile(content, file, section) {
    var docs = [];
    var lines = content.toString().split(NEW_LINE);
    var text;
    var startingLine ;
    var match;
    var inDoc = false;

    lines.forEach(function(line, lineNumber){
      lineNumber++;
      // is the comment starting?
      if (!inDoc && (match = line.match(/^\s*\/\*\*\s*(.*)$/))) {
        line = match[1];
        inDoc = true;
        text = [];
        startingLine = lineNumber;
      }
      // are we done?
      if (inDoc && line.match(/\*\//)) {
        text = text.join('\n');
        text = text.replace(/^\n/, '');
        if (text.match(/@ngdoc/)){
          //console.log(file, startingLine)
          docs.push(new ngdoc.Doc('@section ' + section + '\n' + text, file, startingLine).parse());
        }
        doc = null;
        inDoc = false;
      }
      // is the comment add text
      if (inDoc){
        text.push(line.replace(/^\s*\*\s?/, ''));
      }
    });
    return docs;
  }

  return {
    process: process,
    docs: cache
  };
};