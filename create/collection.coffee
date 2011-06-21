# aliasing <%= "#{@app}.Models" %> (global) as Models (scoped) - this, ofcourse, is optional
Models = <%= "#{@app}.Models" %>

# decalring the class
class <%= "#{@app}.Collections.#{@collection}" %> extends Backbone.Collection
    model: <%= "Models.#{@model}" %>
    url: <%= "'/#{@url}'" %>