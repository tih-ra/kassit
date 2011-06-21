(function() {
  var fs;
  var __slice = Array.prototype.slice;
  fs = require('fs');
  this.mkDir = function(path, cb) {
    var base, err, folder, folders, _i, _len;
    err = '';
    base = '';
    folders = path.replace('//', '/').split('/');
    for (_i = 0, _len = folders.length; _i < _len; _i++) {
      folder = folders[_i];
      base = "" + base + folder;
      try {
        fs.readdirSync(base);
      } catch (e) {
        try {
          fs.mkdirSync(base, 0777, true);
        } catch (e) {
          err = e;
        }
      }
      base = "" + base + "/";
    }
    if (cb) {
      return cb(err);
    }
  };
  this.writeFile = function(file, data, cb) {
    var last, path, _i, _ref;
    _ref = file.replace('//', '/').split('/'), path = 2 <= _ref.length ? __slice.call(_ref, 0, _i = _ref.length - 1) : (_i = 0, []), last = _ref[_i++];
    return this.mkDir(path.join('/'), function(err) {
      if (!err) {
        return fs.writeFile(file, data, cb);
      } else {
        if (cb) {
          return cb(err);
        }
      }
    });
  };
}).call(this);
