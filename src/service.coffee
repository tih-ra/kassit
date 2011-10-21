fs = require('fs')
less = require('less')
watcher = require('kassit/lib/watcher')
compiler = require('kassit/lib/compiler')
uglifier = require('kassit/lib/uglifier')
writer = require('kassit/lib/writer')

@watch = (app) ->
    go = (app, env) ->
        w_inst = new watcher.IncludeWatcher(env)
        c_inst = new compiler.Compiler(app,env)
        
        w_inst.onAdd = c_inst.doDevTmp
        w_inst.onChange = c_inst.doDevTmp
        w_inst.start()
    
    console.log '\n'
    go(app, env) for env in ['server','client']

@build = (app) ->
    go = (app, env) ->
        c_inst = new compiler.Compiler(app,env)
    
        scripts = []
        styles = []
        prodjs = "#{env}.prod/prod.js"
        prodcss = "#{env}.prod/prod.css"
        
        
        includes = JSON.parse(fs.readFileSync "include.json", 'utf-8')[env]
        for file in includes
            [url, method, except] = [file.url.trim(),(if file.method then file.method else 'mangle').trim(),(if file.except then file.except else [])]
                  
            [data, ext] = c_inst.doProdRaw("#{env}/#{url}")
            scripts.push(uglifier[method](data,except)) if ext is 'js'
            styles.push(uglifier.css(data)) if ext is 'css'
    
        # writing the production script
        if scripts.length
            writer.writeFile prodjs, scripts.join(';'), (err) ->
                if err then console.log "  ::error: #{prodjs}" else console.log "  ::compiled: #{prodjs}"
    
        # writing the production css
        if (env is 'client') and (styles.length)
            writer.writeFile prodcss, styles.join(' ').replace(/{/g,' {').replace(/}/g,'} '), (err) ->
                if err then console.log "  ::error: #{prodcss}" else console.log "  ::compiled: #{prodcss}"
    
    console.log '\n'
    go(app, env) for env in ['server','client']
        