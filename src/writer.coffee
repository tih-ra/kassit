fs = require('fs')

# creates the directories path
@mkDir = (path, cb) ->
    err = ''
    base = ''
    folders = path.replace('//','/').split('/')
    for folder in folders
        base = "#{base}#{folder}"
        try
            fs.readdirSync base
        catch e
            try
                fs.mkdirSync base, 0777, true
            catch e
                err = e
        base = "#{base}/"
    
    cb(err) if cb

# writes a file... if path doesnt exists it creates it!    
@writeFile  = (file, data, cb) ->
    [path..., last] = file.replace('//','/').split('/')
    @mkDir path.join('/'), (err) ->
        if !err
            fs.writeFile file, data, cb
        else
            cb(err) if cb