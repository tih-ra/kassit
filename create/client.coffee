app = window['<%= @app %>'] = {}

app.Collections = {}
app.Models = {}
app.Routers = {}
app.Templates = {}
app.Views = {}
               
$(document).ready ->
    # creates instances of the routers but Root. (will initialize the Root later.)
    (app.Routers[k] = new router if k isnt 'Root') for k,router of app.Routers
    app.Routers.Root = new app.Routers.Root
    Backbone.history.start()