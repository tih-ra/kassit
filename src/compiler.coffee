fs = require('fs')
less = require('less')
coffee = require('coffee-script')
writer = require('kassit/lib/writer')
uglifier = require('kassit/lib/uglifier')

class @Compiler
    constructor: (app, path) ->
        @app = app
        @path = path
        
    doProdRaw: (input) ->
        [file...,ext] = input.split('.')
        ext = ext.toLowerCase()
        return @[ext](input,(fs.readFileSync input,'utf-8')) if @[ext]?
        return [0,0]

    # for dev watch.. this will compile and create /.tmp/_controller/file.js or /.tmp/_styles/style.css
    doDevTmp: (input) =>
        [output...,ext] = input.split('.')
        
        output = output.join('.').replace("#{@path}/","#{@path}.dev/")
        ext = ext.toLowerCase()
        if @[ext]?
            try
                data = fs.readFileSync input, 'utf-8'
                [data, ext] = @[ext](input,data)
                writer.writeFile "#{output}.#{ext}", data, (err) ->
                    if err then throw err else console.log "  ::compiled: #{output}.#{ext}"
            catch err
                console.log "  ::error: #{input}\n:: #{err.message}\n"
    
    getPkgName: (input) ->
        [pkg..., ext] = input.replace("#{@path}/",'').replace(/\//g,'.').split('.')
        return pkg.join('.')

    getTmplName: (input) ->
        pkg = @getPkgName(input)
        return pkg.replace('templates.','')
    
    wrapTemplate: (data, tmpl, type) ->
        type = type.toUpperCase()
        return "(function(){#{@app}.Templates['#{tmpl}'] = new Kassit.Template.#{type}(#{data})}).call(this)"
                        
    # data manipulation by file.ext. need to returns the new ext ('js' or 'css') and the data to write into the file.
    js: (input,data) -> return [data, 'js']
    coffee: (input,data) -> return [coffee.compile(data), 'js']
    ejs: (input,data) -> return [@wrapTemplate(JSON.stringify(data), @getTmplName(input), 'ejs'),'js']
    tmpl: (input, data) -> return [@wrapTemplate(JSON.stringify(data), @getTmplName(input), 'tmpl'),'js']
    kup: (input, data) -> return [@wrapTemplate(JSON.stringify("function(){#{uglifier.squeeze(coffee.compile(data,{bare:true}))}}"), @getTmplName(input), 'kup'),'js']
    css: (input, data) -> return [data,'css']
    less: (input, data) ->
        less.render data, (err, css) => if err then throw err else data = css
        return [data,'css']