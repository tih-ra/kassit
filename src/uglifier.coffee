parser = require('uglify-js').parser
uglify = require('uglify-js').uglify
css = require('uglifycss')

@mangle = (data, except) ->
    data = parser.parse(data)
    data = uglify.ast_mangle(data, {except: except})
    data = uglify.ast_squeeze(data)
    return uglify.gen_code(data,{ascii_only: true})
    
@squeeze = (data) ->
    data = parser.parse(data)
    data = uglify.ast_squeeze(data)
    return uglify.gen_code(data,{ascii_only: true})
        
@parse = (data) ->
    data = parser.parse(data)
    return uglify.gen_code(data,{ascii_only: true})
    
@none = (date) ->
    return date

@css = (data) ->
    return css.processString(data)