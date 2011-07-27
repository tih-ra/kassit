fs = require('fs')
#walk = require('walk')

class @Watcher
    constructor: (path) ->
        @path = path
        
    start: ->
        @watching = true
        @getFiles(@initFiles)
 
    stop: ->
        @watching = false
 
    #getFiles: (func) ->
    #    files = []
    #    walker = walk.walk @path, { followLinks: false }
    #    walker.on 'file', (root, stat, next) ->
    #        files.push(root + '/' + stat.name)
    #        next()
    #        
    #    walker.on 'end', ->
    #        func(files)
    
    initFiles: (files) =>
        @fileAdded(file) for file in files
        @files = files
        @getFiles(@checkChanges)

    checkChanges: (files) =>
        added = []
        removed = []
        (added.push(file) unless file in @files) for file in files
        (removed.push(file) unless file in files) for file in @files
        @fileAdded(file) for file in added
        @fileRemoved(file) for file in removed
        
        @files = files
        setTimeout((() => @getFiles(@checkChanges)),2000) if @watching
   
    fileAdded: (file) ->
        fs.watchFile(file,{persistent: true, interval: 1000},(curr,prev) => @fileChanged(curr,prev,file))
        @onAdd(file)

    fileChanged: (curr,prev,file) ->
        if curr.mtime.getTime() isnt prev.mtime.getTime()
            @onChange(file)

    fileRemoved: (file) ->
        fs.unwatchFile(file)
        @onRemove(file)
  
    onAdd: (file) -> null
    onChange: (file) -> null
    onRemove: (file) -> null
    
class @IncludeWatcher extends @Watcher
    getFiles: (func) ->
        try
            files = (JSON.parse fs.readFileSync 'include.json', 'utf-8')[@path]
            files = ("#{@path}/#{file.url}" for file in files)
        catch err
            console.log "  ::error: include.json is not a valid JSON file. check syntex!"
            files = @files
        
        func(files)