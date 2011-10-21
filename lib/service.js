(function() {
  var compiler, fs, less, uglifier, watcher, writer;
  fs = require('fs');
  less = require('less');
  watcher = require('kassit/lib/watcher');
  compiler = require('kassit/lib/compiler');
  uglifier = require('kassit/lib/uglifier');
  writer = require('kassit/lib/writer');
  this.watch = function(app) {
    var env, go, _i, _len, _ref, _results;
    go = function(app, env) {
      var c_inst, w_inst;
      w_inst = new watcher.IncludeWatcher(env);
      c_inst = new compiler.Compiler(app, env);
      w_inst.onAdd = c_inst.doDevTmp;
      w_inst.onChange = c_inst.doDevTmp;
      return w_inst.start();
    };
    console.log('\n');
    _ref = ['server', 'client'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      env = _ref[_i];
      _results.push(go(app, env));
    }
    return _results;
  };
  this.build = function(app) {
    var env, go, _i, _len, _ref, _results;
    go = function(app, env) {
      var c_inst, data, except, ext, file, includes, method, prodcss, prodjs, scripts, styles, url, _i, _len, _ref, _ref2;
      c_inst = new compiler.Compiler(app, env);
      scripts = [];
      styles = [];
      prodjs = "" + env + ".prod/prod.js";
      prodcss = "" + env + ".prod/prod.css";
      includes = JSON.parse(fs.readFileSync("include.json", 'utf-8'))[env];
      for (_i = 0, _len = includes.length; _i < _len; _i++) {
        file = includes[_i];
        _ref = [file.url.trim(), (file.method ? file.method : 'mangle').trim(), (file.except ? file.except : [])], url = _ref[0], method = _ref[1], except = _ref[2];
        _ref2 = c_inst.doProdRaw("" + env + "/" + url), data = _ref2[0], ext = _ref2[1];
        if (ext === 'js') {
          scripts.push(uglifier[method](data, except));
        }
        if (ext === 'css') {
          styles.push(uglifier.css(data));
        }
      }
      if (scripts.length) {
        writer.writeFile(prodjs, scripts.join(';'), function(err) {
          if (err) {
            return console.log("  ::error: " + prodjs);
          } else {
            return console.log("  ::compiled: " + prodjs);
          }
        });
      }
      if ((env === 'client') && styles.length) {
        return writer.writeFile(prodcss, styles.join(' ').replace(/{/g, ' {').replace(/}/g, '} '), function(err) {
          if (err) {
            return console.log("  ::error: " + prodcss);
          } else {
            return console.log("  ::compiled: " + prodcss);
          }
        });
      }
    };
    console.log('\n');
    _ref = ['server', 'client'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      env = _ref[_i];
      _results.push(go(app, env));
    }
    return _results;
  };
}).call(this);
