express = require('kassit/node_modules/express')
app = <%= @app %> = process['<%= @app %>'] = express.createServer()
app.mode = if !(getMode?()) then 'prod' else getMode()
app.port = 3000

app.use(express.bodyParser())
app.use(express.cookieParser())
app.use(express.session({ secret: '<%= String(Math.random()).replace('0.','') %>' }))

app.get '/', (req, res) -> res.sendfile('<%= @index %>.html')
app.get '/<%= @index %>.js', (req, res) -> res.sendfile('<%= @index %>.js')
app.get '/include.json', (req, res) -> res.sendfile('include.json')

app.get '/static/*', (req, res) -> res.sendfile('static/' + req.params[0])

# serving only dev/prod files
(app.get '/client.dev/*', (req, res) ->  res.sendfile('client.dev/' + req.params[0])) if app.mode is 'dev'
(app.get '/client.prod/*', (req, res) -> res.sendfile('client.prod/' + req.params[0])) if app.mode is 'prod'
        
console.log "  ::loading: <%= @app %> is up and serving at http://localhost:#{app.port}"
app.listen(app.port);