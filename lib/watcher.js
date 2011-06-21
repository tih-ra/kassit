(function() {
  var fs, walk;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  fs = require('fs');
  walk = require('walk');
  this.Watcher = (function() {
    function Watcher(path) {
      this.checkChanges = __bind(this.checkChanges, this);
      this.initFiles = __bind(this.initFiles, this);      this.path = path;
    }
    Watcher.prototype.start = function() {
      this.watching = true;
      return this.getFiles(this.initFiles);
    };
    Watcher.prototype.stop = function() {
      return this.watching = false;
    };
    Watcher.prototype.getFiles = function(func) {
      var files, walker;
      files = [];
      walker = walk.walk(this.path, {
        followLinks: false
      });
      walker.on('file', function(root, stat, next) {
        files.push(root + '/' + stat.name);
        return next();
      });
      return walker.on('end', function() {
        return func(files);
      });
    };
    Watcher.prototype.initFiles = function(files) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        this.fileAdded(file);
      }
      this.files = files;
      return this.getFiles(this.checkChanges);
    };
    Watcher.prototype.checkChanges = function(files) {
      var added, file, removed, _i, _j, _k, _l, _len, _len2, _len3, _len4, _ref;
      added = [];
      removed = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        if (__indexOf.call(this.files, file) < 0) {
          added.push(file);
        }
      }
      _ref = this.files;
      for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
        file = _ref[_j];
        if (__indexOf.call(files, file) < 0) {
          removed.push(file);
        }
      }
      for (_k = 0, _len3 = added.length; _k < _len3; _k++) {
        file = added[_k];
        this.fileAdded(file);
      }
      for (_l = 0, _len4 = removed.length; _l < _len4; _l++) {
        file = removed[_l];
        this.fileRemoved(file);
      }
      this.files = files;
      if (this.watching) {
        return setTimeout((__bind(function() {
          return this.getFiles(this.checkChanges);
        }, this)), 2000);
      }
    };
    Watcher.prototype.fileAdded = function(file) {
      fs.watchFile(file, {
        persistent: true,
        interval: 1000
      }, __bind(function(curr, prev) {
        return this.fileChanged(curr, prev, file);
      }, this));
      return this.onAdd(file);
    };
    Watcher.prototype.fileChanged = function(curr, prev, file) {
      if (curr.mtime.getTime() !== prev.mtime.getTime()) {
        return this.onChange(file);
      }
    };
    Watcher.prototype.fileRemoved = function(file) {
      fs.unwatchFile(file);
      return this.onRemove(file);
    };
    Watcher.prototype.onAdd = function(file) {
      return null;
    };
    Watcher.prototype.onChange = function(file) {
      return null;
    };
    Watcher.prototype.onRemove = function(file) {
      return null;
    };
    return Watcher;
  })();
  this.IncludeWatcher = (function() {
    __extends(IncludeWatcher, this.Watcher);
    function IncludeWatcher() {
      IncludeWatcher.__super__.constructor.apply(this, arguments);
    }
    IncludeWatcher.prototype.getFiles = function(func) {
      var file, files;
      try {
        files = (JSON.parse(fs.readFileSync('include.json', 'utf-8')))[this.path];
        files = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = files.length; _i < _len; _i++) {
            file = files[_i];
            _results.push("" + this.path + "/" + file.url);
          }
          return _results;
        }).call(this);
      } catch (err) {
        console.log("  ::error: include.json is not a valid JSON file. check syntex!");
        files = this.files;
      }
      return func(files);
    };
    return IncludeWatcher;
  }).call(this);
}).call(this);
