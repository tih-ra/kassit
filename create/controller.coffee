# aliasing <%= "#{@app}.Views.#{@ctrl}" %> (global) as Views (scoped) - this, ofcourse, is optional
Views = <%= "#{@app}.Views.#{@ctrl}" %>

# decalring the class
class <%= "#{@app}.Controllers.#{@ctrl}" %> extends Backbone.Controller
    routes:
        '<%= @route %>/*'        : 'index'
        #'<%= @route %>/about'    : 'about'
        
    index: ->
        # this is the place to do all the controller logic
        console.log '<%= @ctrl %>.index() was called upon!'
        new Views.Index
    
    # example of another method within the controller
    #about: ->
        #console.log '<%= @ctrl %>.about() was called upon!'
        #new Views.About