(function() {
  var copy, copy_dir, create, create_dir, eco, folder, fs, inflect, kassit, path, writer;
  var __slice = Array.prototype.slice;
  path = require('path');
  fs = require('fs');
  eco = require('eco');
  inflect = require('inflect');
  kassit = require('kassit');
  writer = require('kassit/lib/writer');
  folder = '';
  create_dir = path.join(path.dirname(fs.realpathSync(__filename)), '../create');
  create = function(param) {
    var data;
    if (folder) {
      param.to = "" + folder + "/" + param.to;
    }
    try {
      data = eco.render(fs.readFileSync("" + create_dir + "/" + param.from, 'utf-8'), param.data);
      return writer.writeFile(param.to, data, function(err) {
        if (!err) {
          return console.log("  ::created: " + param.to);
        } else {
          throw err;
        }
      });
    } catch (err) {
      console.log("  ::error: from: " + param.from + ", to: " + param.to);
      throw err;
    }
  };
  copy_dir = path.join(path.dirname(fs.realpathSync(__filename)), '../copy');
  copy = function(param) {
    var data;
    if (folder) {
      param.to = "" + folder + "/" + param.to;
    }
    try {
      data = fs.readFileSync("" + copy_dir + "/" + param.from, 'utf-8');
      return writer.writeFile(param.to, data, function(err) {
        if (!err) {
          return console.log("  ::created: " + param.to);
        } else {
          throw err;
        }
      });
    } catch (err) {
      console.log("  ::error: from: " + param.from + ", to: " + param.to);
      throw err;
    }
  };
  this.application = function(app) {
    var index;
    app = inflect.camelize(app);
    index = folder = inflect.underscore(app);
    create({
      from: 'package.json',
      to: 'package.json',
      data: {
        app: app,
        ver: kassit.version
      }
    });
    copy({
      from: 'include.json',
      to: 'include.json'
    });
    create({
      from: 'index.js',
      to: "" + index + ".js",
      data: {
        app: app,
        index: index
      }
    });
    create({
      from: 'server.coffee',
      to: 'server/server.coffee',
      data: {
        app: app,
        index: index
      }
    });
    create({
      from: 'index.html',
      to: "" + index + ".html",
      data: {
        app: app,
        index: index
      }
    });
    copy({
      from: 'jquery.js',
      to: 'client/lib/jquery.js'
    });
    copy({
      from: 'underscore.js',
      to: 'client/lib/underscore.js'
    });
    copy({
      from: 'backbone.js',
      to: 'client/lib/backbone.js'
    });
    copy({
      from: 'coffeekup.js',
      to: 'client/lib/coffeekup.js'
    });
    copy({
      from: 'ejs.js',
      to: 'client/lib/ejs.js'
    });
    copy({
      from: 'kassit.coffee',
      to: 'client/lib/kassit.coffee'
    });
    create({
      from: 'client.coffee',
      to: 'client/client.coffee',
      data: {
        app: app
      }
    });
    copy({
      from: 'master.less',
      to: 'client/style/master.less'
    });
    this.view(app, 'Root');
    this.template('Root/Layout');
    this.template('Root/Index');
    return this.controller(app, 'Root');
  };
  this.model = function(app, model) {
    model = inflect.camelize(model);
    return create({
      from: 'model.coffee',
      to: "client/models/" + (inflect.underscore(model)) + ".coffee",
      data: {
        app: app,
        model: model
      }
    });
  };
  this.collection = function(app, model) {
    var url;
    model = inflect.camelize(model);
    url = inflect.underscore(inflect.pluralize(model));
    return create({
      from: 'collection.coffee',
      to: "client/collections/" + url + ".coffee",
      data: {
        app: app,
        model: model,
        collection: inflect.pluralize(model),
        url: url
      }
    });
  };
  this.view = function(app, view) {
    view = inflect.camelize(view);
    return create({
      from: 'view.coffee',
      to: "client/views/" + (inflect.underscore(view)) + "_view.coffee",
      data: {
        app: app,
        view: view,
        id: inflect.underscore(view)
      }
    });
  };
  this.template = function(template) {
    var layout, view, _ref, _ref2, _ref3;
    _ref = template.split('/'), view = _ref[0], template = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
    if (template.length === 0) {
      if (view.toLowerCase() === 'layout') {
        layout = true;
      }
      _ref2 = ['Shared', view], view = _ref2[0], template = _ref2[1];
    } else {
      if (template[template.length - 1].toLowerCase() === 'layout') {
        layout = true;
      }
      _ref3 = [view, template.join('/')], view = _ref3[0], template = _ref3[1];
    }
    return create({
      from: 'template.kup',
      to: "client/templates/" + (inflect.underscore(view)) + "/" + (inflect.underscore(template)) + ".kup",
      data: {
        layout: (layout ? inflect.underscore(view) : false)
      }
    });
  };
  this.controller = function(app, ctrl) {
    ctrl = inflect.camelize(ctrl);
    return create({
      from: 'controller.coffee',
      to: "client/controllers/" + (inflect.underscore(ctrl)) + "_controller.coffee",
      data: {
        app: app,
        ctrl: ctrl,
        route: (ctrl.toLowerCase() === 'root' ? '' : "/" + (inflect.underscore(ctrl)))
      }
    });
  };
  this.restful = function(app, model) {
    var url;
    model = inflect.camelize(model);
    url = inflect.underscore(inflect.pluralize(model));
    return create({
      from: 'restful.coffee',
      to: "server/" + url + ".coffee",
      data: {
        app: app,
        model: model,
        object: inflect.underscore(model),
        url: url
      }
    });
  };
  this.scaffold = function(app, model) {
    var models;
    this.model(app, model);
    this.collection(app, model);
    this.restful(app, model);
    models = inflect.pluralize(model);
    this.view(app, models);
    this.template("" + models + "/layout");
    this.template("" + models + "/index");
    return this.controller(app, models);
  };
}).call(this);
