(function() {
  var env, fs, getMode, init, initDev, initProd, readFile, readStyle, scripts, styles;
  var __slice = Array.prototype.slice, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  scripts = ['js', 'coffee', 'ejs', 'kup'];
  styles = ['css', 'less'];
  readFile = function(url) {
    var data, xhr;
    if (env === 'client') {
      xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.send(null);
      data = xhr.responseText;
    } else if (env === 'server') {
      data = fs.readFileSync(url, 'utf-8');
    }
    return data;
  };
  getMode = function() {
    var cmd, mode, s, script, tags, _i, _j, _len, _ref;
    if (env === 'client') {
      tags = document.getElementsByTagName('script');
      script = '';
      for (_i = 0, _len = tags.length; _i < _len; _i++) {
        s = tags[_i];
        if (s.src.match('<%= @index %>.js')) {
          script = s;
        }
      }
      mode = script.src.split('?')[1];
    } else if (env === 'server') {
      _ref = process.argv, cmd = 2 <= _ref.length ? __slice.call(_ref, 0, _j = _ref.length - 1) : (_j = 0, []), mode = _ref[_j++];
    }
    return mode;
  };
  init = function() {
    var mode;
    mode = getMode();
    if (mode === 'dev') {
      return initDev();
    } else if (mode === 'prod') {
      return initProd();
    } else {
      return console.log('Invalid argument for loading <%= @index %>.js');
    }
  };
  initDev = function() {
    var css, ext, file, files, js, url, _i, _j, _k, _l, _len, _len2, _len3, _ref, _results;
    css = [];
    js = [];
    files = JSON.parse(readFile('include.json'))[env];
    files = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        _results.push("" + env + ".dev/" + file.url);
      }
      return _results;
    })();
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      file = files[_i];
      _ref = file.trim().split('.'), file = 2 <= _ref.length ? __slice.call(_ref, 0, _j = _ref.length - 1) : (_j = 0, []), ext = _ref[_j++];
      file = file.join('.');
      if (__indexOf.call(styles, ext) >= 0) {
        css.push("" + file + ".css");
      }
      if (__indexOf.call(scripts, ext) >= 0) {
        js.push("" + file + ".js");
      }
    }
    if (env === 'client') {
      for (_k = 0, _len2 = css.length; _k < _len2; _k++) {
        url = css[_k];
        readStyle(url);
      }
    }
    _results = [];
    for (_l = 0, _len3 = js.length; _l < _len3; _l++) {
      url = js[_l];
      if (env === 'server') {
        console.log("  ::loading: loaded file " + url);
      }
      _results.push(eval(readFile(url)));
    }
    return _results;
  };
  initProd = function() {
    if (env === 'client') {
      readStyle("" + env + ".prod/prod.css");
    }
    return eval(readFile("" + env + ".prod/prod.js"));
  };
  if (typeof window !== "undefined" && window !== null) {
    env = 'client';
    readStyle = function(url) {
      var link;
      link = document.createElement('link');
      link.href = url;
      link.type = 'text/css';
      link.rel = 'stylesheet';
      return document.getElementsByTagName('head')[0].appendChild(link);
    };
    window.onload = function() {
      return init();
    };
  } else if (typeof process !== "undefined" && process !== null) {
    env = 'server';
    fs = require('fs');
    init();
  }
}).call(this);
