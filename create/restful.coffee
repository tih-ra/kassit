app = <%= @app %> = process['<%= @app %>']

# create a new <%= @model %>
app.post '/<%= @url %>', (req, res) ->
    # do your own Model/DB logic.
    # for ex: 
    
    #<%= @object %> = new <%= @model %>(req.body)
    #<%= @object %>.save()
    
    # sending back the object to Backbone
    # if id property exists it marks it as saved
    res.send(JSON.stringify(<%= @object %>))

# read a <%= @model %> by id
app.get '/<%= @url %>/:id' , (req, res) ->
    res.send("Send Something Back!")
    
# update a <%= @model %> by id
app.put '/<%= @url %>/:id', (req, res) ->
    res.send("Send Something Back!")
        
# delete a <%= @model %> by id
app.del '/<%= @url %>/:id', (req, res) ->
    res.send("Send Something Back!")