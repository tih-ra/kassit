(function() {
  var app, args, errors, fs, generator, kassit, options, parseApp, parseArgs, printUsage, printVersion, service, setOptions;
  var __slice = Array.prototype.slice, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  fs = require('fs');
  kassit = require('kassit');
  generator = require('kassit/lib/generator');
  service = require('kassit/lib/service');
  app = '';
  args = [];
  errors = [];
  options = [];
  parseArgs = function(bin) {
    var i, pairs, _ref, _ref2;
    if (bin == null) {
      bin = 'kassit';
    }
    args = process.argv.join(' ');
    _ref = args.split(bin), bin = _ref[0], args = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
    args = args.join(bin).trim().split(' ');
    if (args[0] === '') {
      args = [];
    }
    pairs = [];
    for (i = 0, _ref2 = args.length; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
      if (args[i].match(/--[A-z]/)) {
        if (args[i + 1]) {
          if (args[i + 1].match(/--[A-z]/)) {
            pairs.push({
              "switch": args[i],
              param: '--null'
            });
          } else {
            pairs.push({
              "switch": args[i],
              param: args[i + 1]
            });
            i++;
          }
        } else {
          pairs.push({
            "switch": args[i],
            param: '--null'
          });
        }
      } else {
        errors.push("'" + args[i] + "' is not recognized as a switch or a parameter.");
      }
    }
    return args = pairs;
  };
  parseApp = function() {
    var config;
    try {
      config = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      if (config.dependencies.kassit) {
        return app = config.name;
      }
    } catch (_e) {}
  };
  setOptions = function() {
    var appoptions, genoptions, newoptions, opt, _i, _j, _k, _len, _len2, _len3, _results;
    if (!app) {
      newoptions = [
        {
          "switch": '--application',
          match: /^[A-z]/,
          eval: 'generator.application(param)',
          show: 'creates ./[APP]'
        }
      ];
      for (_i = 0, _len = newoptions.length; _i < _len; _i++) {
        opt = newoptions[_i];
        options.push(opt);
      }
    } else {
      appoptions = [
        {
          "switch": '--model',
          match: /^[A-z]/,
          eval: 'generator.model(app,param)',
          show: 'creates ./client/models/[MODEL].coffee'
        }, {
          "switch": '--collection',
          match: /^[A-z]/,
          eval: 'generator.collection(app,param)',
          show: 'creates ./client/collections/[MODEL]s.coffee'
        }, {
          "switch": '--view',
          match: /^[A-z]/,
          eval: 'generator.view(app,param)',
          show: 'creates ./client/views/[VIEW]_view.coffee'
        }, {
          "switch": '--template',
          match: /^[A-z]/,
          eval: 'generator.template(param)',
          show: 'creates ./client/templates/[VIEW/TMPL].kup'
        }, {
          "switch": '--controller',
          match: /^[A-z]/,
          eval: 'generator.controller(app,param)',
          show: 'creates ./client/controllers/[CTRL]_controller.coffee'
        }, {
          "switch": '--restful',
          match: /^[A-z]/,
          eval: 'generator.restful(app,param)',
          show: 'creates ./server/[MODEL]s.coffee'
        }, {
          "switch": '--scaffold',
          match: /^[A-z]/,
          eval: 'generator.scaffold(app,param)',
          show: 'scaffolds Model/View/Controller/Restful'
        }, {
          space: true
        }, {
          "switch": '--watch',
          match: '--null',
          eval: 'service.watch(app)',
          show: 'watches the project for changes. required while developing'
        }, {
          "switch": '--build',
          match: '--null',
          eval: 'service.build(app)',
          show: 'builds a minified production version'
        }
      ];
      for (_j = 0, _len2 = appoptions.length; _j < _len2; _j++) {
        opt = appoptions[_j];
        options.push(opt);
      }
    }
    genoptions = [
      {
        space: true
      }, {
        "switch": '--version',
        match: '--null',
        eval: 'printVersion()',
        show: 'display Kassits version'
      }
    ];
    _results = [];
    for (_k = 0, _len3 = genoptions.length; _k < _len3; _k++) {
      opt = genoptions[_k];
      _results.push(options.push(opt));
    }
    return _results;
  };
  printUsage = function() {
    var opt, _i, _len, _results;
    console.log('\n  Usage: kassit [switches] [...]\n');
    _results = [];
    for (_i = 0, _len = options.length; _i < _len; _i++) {
      opt = options[_i];
      _results.push(opt.space ? console.log("\n") : console.log("  " + opt["switch"] + "\t" + opt.show));
    }
    return _results;
  };
  printVersion = function() {
    return console.log("\n  Kassit. version: " + kassit.version);
  };
  this.run = function() {
    var arg, err, o, param, switches, _i, _j, _k, _l, _len, _len2, _len3, _len4, _ref, _results, _results2;
    parseArgs();
    parseApp();
    setOptions();
    switches = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = options.length; _i < _len; _i++) {
        o = options[_i];
        _results.push(o["switch"]);
      }
      return _results;
    })();
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      arg = args[_i];
      if (_ref = arg["switch"], __indexOf.call(switches, _ref) >= 0) {
        for (_j = 0, _len2 = options.length; _j < _len2; _j++) {
          o = options[_j];
          if (o["switch"] === arg["switch"]) {
            if (!arg.param.match(o.match)) {
              errors.push("'" + arg["switch"] + "' the parameter supplied doesn't match the cretiria");
            }
          }
        }
      } else {
        errors.push("'" + arg["switch"] + "' is not recognized as a valid switch.");
      }
    }
    if (errors.length > 0) {
      console.log('\n');
      _results = [];
      for (_k = 0, _len3 = errors.length; _k < _len3; _k++) {
        err = errors[_k];
        _results.push(console.log("  ::error: " + err));
      }
      return _results;
    } else {
      if (args.length === 0) {
        return printUsage();
      } else {
        _results2 = [];
        for (_l = 0, _len4 = args.length; _l < _len4; _l++) {
          arg = args[_l];
          _results2.push((function() {
            var _len5, _m, _results3;
            _results3 = [];
            for (_m = 0, _len5 = options.length; _m < _len5; _m++) {
              o = options[_m];
              _results3.push(o["switch"] === arg["switch"] ? (param = arg.param, eval(o.eval)) : void 0);
            }
            return _results3;
          })());
        }
        return _results2;
      }
    }
  };
}).call(this);
