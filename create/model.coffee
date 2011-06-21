# decalring the class
class <%= "#{@app}.Models.#{@model}" %> extends Backbone.Model
    # return false if validates correctly, else returns a value (or some)
    validate: (attr) ->
        #return 'Error: Validation Failed!'
        return false