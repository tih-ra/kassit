window.Kassit = {}
Kassit.Template = {}
class Kassit.Template.EJS
    constructor: (json) ->
        @ejs = new window.EJS({text: json})
    render: (data = {}) ->
        return @ejs.render(data)
        
class Kassit.Template.KUP
    constructor: (json) ->
        @kup = eval(json)
    render: (data = {}, helpers = {}) ->
        return CoffeeKup.render(@kup,{context: data, locals: helpers})