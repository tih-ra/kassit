fs            = require 'fs'
{print}       = require 'sys'
{spawn, exec} = require 'child_process'

build = (watch, callback) ->
    if typeof watch is 'function'
        callback = watch
        watch = false
    options = ['-c', '-o', 'lib', 'src']
    options.unshift '-w' if watch

    coffee = spawn 'coffee', options
    coffee.stdout.on 'data', (data) -> print data.toString()
    coffee.stderr.on 'data', (data) -> print data.toString()
    coffee.on 'exit', (status) ->
        create_index()
        callback?() if status is 0

mangle = (data, except) ->
    parser = require('uglify-js').parser
    uglify = require('uglify-js').uglify
    data = parser.parse(data)
    data = uglify.ast_mangle(data, {except: except})
    data = uglify.ast_squeeze(data)
    return uglify.gen_code(data,{ascii_only: true})

create_index = ->
    fs.readFile 'lib/index.js','utf-8',(err,data) ->
        if !err
            fs.writeFile 'create/index.js', mangle(data), (err) ->
                console.log '  ::error: can not write create/index.js' if err
        else
            console.log '  ::error: can not read lib/index.js'

build()