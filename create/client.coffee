app = window['<%= @app %>'] = {}

app.Collections = {}
app.Controllers = {}
app.Helpers = {}
app.Models = {}
app.Templates = {}
app.Views = {}
               
$(document).ready ->
    # creates instances of the controllers but Root. (will initialize the Root later.)
    (app.Controllers[k] = new controller if k isnt 'Root') for k,controller of app.Controllers
    app.Controllers.Root = new app.Controllers.Root
    Backbone.history.start()
    
    # binding empty hash to root.index and triggering hashchange!
    $(window).bind 'hashchange', -> app.Controllers.Root.index() if !window.location.hash
    $(window).trigger 'hashchange'