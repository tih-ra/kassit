fs = require('fs')
kassit = require('kassit')
generator = require('kassit/lib/generator')
service = require('kassit/lib/service')

app = ''
args = []
errors = []
options = []

parseArgs = (bin = 'kassit') ->
    args = process.argv.join(' ')
    [bin, args...] = args.split(bin)
    args = args.join(bin).trim().split(' ')
    args = [] if args[0] is ''
    
    pairs = []
    for i in [0...args.length]
        if args[i].match(/--[A-z]/)
            if args[i+1]
                if args[i+1].match(/--[A-z]/)
                    pairs.push { switch: args[i], param: '--null'}
                else
                    pairs.push { switch: args[i], param:args[i+1]}
                    i++
            else
                pairs.push { switch: args[i], param: '--null'}
        else
            errors.push "'#{args[i]}' is not recognized as a switch or a parameter."
    args = pairs
    
parseApp = ->
    # checks for application name.
    try
        config = (JSON.parse fs.readFileSync 'package.json', 'utf-8')
        app = config.name if config.dependencies.kassit
        
setOptions = ->
    if !app
        newoptions = [
            (switch: '--application', match: /^[A-z]/ , eval: 'generator.application(param)'    , show: 'creates ./[APP]')]
        options.push(opt) for opt in newoptions
    else
        appoptions = [
            (switch: '--model'      , match: /^[A-z]/ , eval: 'generator.model(app,param)'      , show: 'creates ./client/models/[MODEL].coffee')
            (switch: '--collection' , match: /^[A-z]/ , eval: 'generator.collection(app,param)' , show: 'creates ./client/collections/[MODEL]s.coffee')
            (switch: '--view'       , match: /^[A-z]/ , eval: 'generator.view(app,param)'       , show: 'creates ./client/views/[VIEW]_view.coffee')
            (switch: '--template'   , match: /^[A-z]/ , eval: 'generator.template(param)'       , show: 'creates ./client/templates/[VIEW/TMPL].kup')
            (switch: '--controller' , match: /^[A-z]/ , eval: 'generator.controller(app,param)' , show: 'creates ./client/controllers/[CTRL]_controller.coffee')
            (switch: '--restful'    , match: /^[A-z]/ , eval: 'generator.restful(app,param)'    , show: 'creates ./server/[MODEL]s.coffee')
            (switch: '--scaffold'   , match: /^[A-z]/ , eval: 'generator.scaffold(app,param)'   , show: 'scaffolds Model/View/Controller/Restful')
            (space: true)
            (switch: '--watch'      , match: '--null' , eval: 'service.watch(app)'              , show: 'watches the project for changes. required while developing')
            (switch: '--build'      , match: '--null' , eval: 'service.build(app)'              , show: 'builds a minified production version')]
            
                        
        options.push(opt) for opt in appoptions

    genoptions = [
        (space: true)
        (switch: '--version', match: '--null', eval: 'printVersion()', show: 'display Kassits version')]
    options.push(opt) for opt in genoptions
    

printUsage = ->
    console.log '\n  Usage: kassit [switches] [...]\n'
    for opt in options
        if opt.space
            console.log "\n"
        else
            console.log "  #{opt.switch}\t#{opt.show}"
            
printVersion = ->
    console.log "\n  Kassit. version: #{kassit.version}"

@run = ->
    parseArgs()
    parseApp()
    setOptions()
    
    switches = (o.switch for o in options)
    for arg in args
        if arg.switch in switches
            for o in options
                if o.switch is arg.switch
                    if !arg.param.match(o.match)
                        errors.push "'#{arg.switch}' the parameter supplied doesn't match the cretiria"
        else
            errors.push "'#{arg.switch}' is not recognized as a valid switch."
    
    if errors.length > 0
        console.log '\n'
        console.log "  ::error: #{err}" for err in errors
    else
        if args.length is 0
            printUsage();
        else
            for arg in args
                for o in options
                    if o.switch is arg.switch
                        param = arg.param
                        eval(o.eval)