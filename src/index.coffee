# this file is the index template for applications.
# it's actually ain't used in the package at all.

scripts = ['js','coffee','ejs','kup']; styles = ['css','less']

# Server & Client Compatiable
readFile = (url) ->
    if env is 'client'
        xhr = new XMLHttpRequest()
        xhr.open('GET',url,false)
        xhr.send(null)
        data = xhr.responseText
    else if env is 'server'
        data = fs.readFileSync(url, 'utf-8')
        
    return data
    
getMode = ->
    if env is 'client'
        tags = document.getElementsByTagName('script')
        script = ''
        (script = s if s.src.match('<%= @index %>.js')) for s in tags
        mode = script.src.split('?')[1]
    else if env is 'server'
        [cmd..., mode] = process.argv
    return mode

init = ->
    mode = getMode()
    if mode is 'dev'
        initDev()
    else if mode is 'prod'
        initProd()
    else
        console.log 'Invalid argument for loading <%= @index %>.js'

initDev = ->
    css = []
    js = []
    files = JSON.parse(readFile('include.json'))[env]
    files = ("#{env}.dev/#{file.url}" for file in files)
    
    for file in files
        [file...,ext] = file.trim().split('.')
        file = file.join('.')
        css.push("#{file}.css") if ext in styles
        js.push("#{file}.js") if ext in scripts
        
    (readStyle(url) for url in css) if env is 'client'
    for url in js
        console.log "  ::loading: loaded file #{url}" if env is 'server'
        eval(readFile(url))
    
initProd = ->
    readStyle("#{env}.prod/prod.css") if env is 'client'
    eval(readFile("#{env}.prod/prod.js"))

        
if window?
    env = 'client' 
    readStyle = (url) ->
        link = document.createElement('link')
        link.href = url
        link.type = 'text/css'
        link.rel = 'stylesheet'
        document.getElementsByTagName('head')[0].appendChild(link)
    
    window.onload = -> init()
    
else if process?
    env = 'server'
    fs = require('fs')
    init()