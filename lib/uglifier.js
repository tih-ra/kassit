(function() {
  var parser, uglify;
  parser = require('uglify-js').parser;
  uglify = require('uglify-js').uglify;
  this.mangle = function(data, except) {
    data = parser.parse(data);
    data = uglify.ast_mangle(data, {
      except: except
    });
    data = uglify.ast_squeeze(data);
    return uglify.gen_code(data, {
      ascii_only: true
    });
  };
  this.squeeze = function(data) {
    data = parser.parse(data);
    data = uglify.ast_squeeze(data);
    return uglify.gen_code(data, {
      ascii_only: true
    });
  };
  this.parse = function(data) {
    data = parser.parse(data);
    return uglify.gen_code(data, {
      ascii_only: true
    });
  };
}).call(this);
