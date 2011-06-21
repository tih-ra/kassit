(function() {
  var config, fs, path;
  fs = require('fs');
  path = require('path');
  config = JSON.parse(fs.readFileSync(path.join(path.dirname(fs.realpathSync(__filename)), '../package.json'), 'utf-8'));
  this.version = config.version;
}).call(this);
