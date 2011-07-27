# aliasing <%= "#{@app}.Views.#{@router}" %> (global) as Views (scoped) - this, ofcourse, is optional
Views = <%= "#{@app}.Views.#{@router}" %>

# decalring the class
class <%= "#{@app}.Routers.#{@router}" %> extends Backbone.Router
    routes:
        '<%= @route %>/*'        : 'index'
        #'<%= @route %>/about'    : 'about'
        
    index: ->
        # this is the place to do all the router logic
        console.log '<%= @router %>.index() was called upon!'
        new Views.Index
    
    # example of another method within the router
    #about: ->
        #console.log '<%= @router %>.about() was called upon!'
        #new Views.About