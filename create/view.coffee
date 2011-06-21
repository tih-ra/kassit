# creating <%= "#{@app}.Views.#{@view}" %> (global) as <%= @view %> (scoped)
<%= @view %> = <%= "#{@app}.Views.#{@view}" %> = {}

# aliasing <%= "#{@app}.Templates" %> (global) as Templates (scoped) - this, ofcourse, is optional
Templates = <%= "#{@app}.Templates" %>

# declaring the layout class
class <%= "#{@view}.Layout" %> extends Backbone.View
    className: <%= "'#{@id}'" %>
    template: Templates[<%= "'#{@id}.layout'" %>]
    initialize: ->
        # checking if there is a need to reload the layout element for this view.
        if $('html').attr('class') isnt @className
            # setting the html class to the view name
            $('html').attr('class',@className)
            # rendering the template into the layout element
            $(@el).html @template.render()
            # replacing the body content with the element
            $(document.body).html @el

# declaring the index class        
class <%= "#{@view}.Index" %> extends Backbone.View
    template: Templates[<%= "'#{@id}.index'" %>]
    initialize: ->
        # renders the layout.
        new <%= "#{@view}.Layout" %>
        # renders the main content.
        $(@el).html @template.render()
        # replacing the #<%= @id %> content with the element
        $('#<%= @id %>').html @el