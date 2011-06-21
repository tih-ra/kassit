# INCLUDES
path = require('path')
fs = require('fs')
eco = require('eco')
inflect = require('inflect')
kassit = require('kassit')
writer = require('kassit/lib/writer')

# PRIVATE METHODS
folder = ''
create_dir = path.join(path.dirname(fs.realpathSync(__filename)), '../create')
create = (param) ->
    param.to = "#{folder}/#{param.to}" if folder
    try
        data = (eco.render (fs.readFileSync "#{create_dir}/#{param.from}", 'utf-8'), param.data)
        writer.writeFile param.to, data, (err) ->
            if !err then console.log "  ::created: #{param.to}" else throw err
    catch err
        console.log "  ::error: from: #{param.from}, to: #{param.to}"
        throw err

copy_dir = path.join(path.dirname(fs.realpathSync(__filename)), '../copy') 
copy = (param) ->
    param.to = "#{folder}/#{param.to}" if folder
    try
        data = fs.readFileSync("#{copy_dir}/#{param.from}", 'utf-8')
        writer.writeFile param.to, data, (err) ->
            if !err then console.log "  ::created: #{param.to}" else throw err
    catch err
        console.log "  ::error: from: #{param.from}, to: #{param.to}"
        throw err

# PUBLIC METHODS
@application = (app) ->
    app = inflect.camelize(app)
    index = folder = inflect.underscore(app)
    
    # loader and basic package
    create
        from: 'package.json'
        to: 'package.json'
        data:
            app: app
            ver: kassit.version
            
    copy
        from: 'include.json'
        to: 'include.json'
        
    create
        from: 'index.js'
        to: "#{index}.js"
        data:
            app: app
            index: index
   
    # server side
    create
        from: 'server.coffee'
        to: 'server/server.coffee'
        data:
            app: app
            index: index
   
    # client side
    create
        from: 'index.html'
        to: "#{index}.html"
        data:
            app: app
            index: index
            
    copy
        from: 'jquery.js'
        to: 'client/lib/jquery.js'
        
    copy
        from: 'underscore.js'
        to: 'client/lib/underscore.js'
    
    copy
        from: 'backbone.js'
        to: 'client/lib/backbone.js'
    
    copy
        from: 'coffeekup.js'
        to: 'client/lib/coffeekup.js'
        
    copy
        from: 'ejs.js'
        to: 'client/lib/ejs.js'
    
    copy
        from: 'kassit.coffee'
        to: 'client/lib/kassit.coffee'
            
    create
        from: 'client.coffee'
        to: 'client/client.coffee'
        data:
            app: app
 
    copy
        from: 'master.less'
        to: 'client/style/master.less'
        
    
    @view(app, 'Root')
    @template('Root/Layout')
    @template('Root/Index')
    @controller(app,'Root')
                
@model = (app, model) ->
    model = inflect.camelize(model)
    create
        from: 'model.coffee'
        to: "client/models/#{inflect.underscore(model)}.coffee"
        data:
            app: app
            model: model

@collection = (app, model) ->
    model = inflect.camelize(model)
    url = inflect.underscore(inflect.pluralize(model))
    create
        from: 'collection.coffee'
        to: "client/collections/#{url}.coffee"
        data:
            app: app
            model: model
            collection: inflect.pluralize(model)
            url: url
            
@view = (app, view) ->
    view = inflect.camelize(view)
    create
        from: 'view.coffee'
        to: "client/views/#{inflect.underscore(view)}_view.coffee"
        data:
            app: app
            view: view
            id: inflect.underscore(view)
            
@template = (template) ->
    # spliting to view and template
    [view, template...] = template.split('/')
    
    # if there is no view setting it to the Shared view folder..
    if template.length is 0
        layout = true if view.toLowerCase() is 'layout'
        [view, template] = ['Shared',view]
    else
        layout = true if template[template.length - 1].toLowerCase() is 'layout'
        [view, template] = [view, template.join('/')]
    
    create
        from: 'template.kup'
        to: "client/templates/#{inflect.underscore(view)}/#{inflect.underscore(template)}.kup"
        data:
            layout: (if layout then inflect.underscore(view) else false)

@controller = (app, ctrl) ->
    ctrl = inflect.camelize(ctrl)
    create
        from: 'controller.coffee'
        to: "client/controllers/#{inflect.underscore(ctrl)}_controller.coffee"
        data:
            app: app
            ctrl: ctrl
            route: (if ctrl.toLowerCase() is 'root' then '' else "/#{inflect.underscore(ctrl)}")
            
@restful = (app, model) ->
    model = inflect.camelize(model)
    url = inflect.underscore(inflect.pluralize(model))
    create
        from: 'restful.coffee'
        to: "server/#{url}.coffee"
        data:
            app: app
            model: model
            object: inflect.underscore(model)
            url: url

@scaffold  = (app,model) ->
    @model(app,model)
    @collection(app,model)
    @restful(app, model)
    models = inflect.pluralize(model)
    @view(app, models)
    @template("#{models}/layout")
    @template("#{models}/index")
    @controller(app,models)