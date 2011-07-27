# Kassit

  Rapid Client-Side AJAX Applications Development Framework  
  mainly built and depends on [Node.JS](http://nodejs.org), [CoffeeScript](http://jashkenas.github.com/coffee-script/) and [Backbone](http://http://documentcloud.github.com/backbone/)
  
  Kassit is named after a popular 70's coffeeshop in Tel-Aviv (knowned as a gathering place for intellectuals - mostly poets)
  
## Installation

  in order to use Kassit you need to install it globaly.  
  you can do so by typing (ofcourse you must have [npm](http://npmjs.org/) installed)
    
    $ npm install -g kassit

  note for windows users: you might need to run this command a couple of times.  
  i think thats due an error in npm and because those packages has number of dependencies.  
  in the end it works.
  
  
## Quick Start

  creating the appplication:

    $ cd /my/projects
    $ kassit --application FirstApp
    
  this will create '/my/projects/first_app' directory and the project base files. (see switches section below)  
  now watch the application:

    $ cd /my/projects/first_app
    $ kassit --watch

  now you can run the application in your browser by openning 'first_app.html'.  
  you can also run an [express](http://expressjs.com/) based web server: (within another terminal)
    
    $ node first_app.js dev
    
  this will serve the application over http://localhost:3000

## Command Line Switches

### this switch available globaly
  
    $ kassit --version
    
  prints out the version of the installed kassit package
  
  ----------------------------------------
  
### this switch only available outside of an application directory
  
    $ kassit --application [APP]
  
  generates a project directory for [APP]  
  [APP] directory is underscored using [inflect](https://github.com/MSNexploder/inflect)  
  example for FirstApp as [APP]:
  
  
    first_app/
        client/
            collections/
            lib/
                backbone.js
                coffeekup.js
                jquery.js
                kassit.coffee
                underscore.js
            models/
            routers/
                root_router.coffee
            style/
                master.less
            templates/
                root/
                    index.kup
                    layout.kup
            views/
                root_views.coffeee
            client.coffee
        server/
            server.coffee
        static/
        first_app.html
        first_app.js
        include.json
        package.json

  ----------------------------------------
  
### these switches only available within an application directory
  
    $ kassit --model [MODEL]

  generates a model.  
  'client/models/latte.coffee' for Latte as [MODEL]
  
    $ kassit --collection [MODEL]
    
  generates a collection. plurelizes and underscores the [MODEL] using inflect  
  'client/collections/lattes.coffee' for Latte as [MODEL]

    $ kassit --view [VIEW]
    
  generates a view.  
  'client/views/menu_view.coffee' for Menu as [VIEW]
  
    $ kassit --template [VIEW/TMPL]
    
  generates a template.  
  'client/templates/menu/layout.kup' for Menu/Layout as [VIEW/TMPL]
  
    $ kassit --router [ROUTER]
    
  generates a router.  
  'client/routers/menu_router.coffee for Menu as [ROUTER]
  
    $ kassit --restful [MODEL]
    
  generates a server side restful methods. plurelizes and underscores the [MODEL] using inflect  
  'server/lattes.coffee' for Latte as [MODEL]
  
    $ kassit --scaffold [MODEL]
    
  generates a complete Model/Collection/View/Templates/Router/Restful files.  
  example using Latte as [MODEL]:
  
    'client/models/latte.coffee'
    'client/collections/lattes.coffee'
    'client/views/lattes_view.coffee'
    'client/templates/lattes/layout.kup'
    'client/templates/lattes/index.kup'
    'client/router/lattes_router.coffee'
    'server/lattes.coffee'
  
  these switches can come combined... for ex:
  
    $ kassit --collection Latte --model Latte --view Menu
    
  ----------------------------------------
  
### these switches only available within an application directory
  
    $ kassit --watch
    
  watch for changes for all the files listed within include.json.  
  compiles .coffee, .kup, .less files on change.  
  it doesn't not output compiled material within the original folder (in order to keep the project clean as possiable)  
  what it does is to compile/copy the directory tree within client/server to the equivalent client.dev/server.dev  
  
  !notice!  
  whenever you add a new file to the client/server folders you need to add it to include.json (even plain .js/.css files)  
  this is essential, otherwise the file wont compile nor load (running the project requires that!)
  
    $ kassit --build
    
  builds (minifiy the different scripts and stylesheets) the application.  
  same as watch, it doesn't output built material into the original folder.  
  what it does is to create prod.js and prod.css inside client.prod/server.prod  
  
  !notice!  
  only files listed in include.json will be added to the prod.js and prod.css
  
## More Stuff Ya Should Know:

  -------------
  include.json:  
  
    '''
      {
          "client": [
              { "url": "lib/jquery.js" }
      ,       { "url": "lib/underscore.js" }
      ,       { "url": "lib/backbone.js" }
      ,       { "url": "lib/coffeekup.js", "method": "squeeze" }
              ...
      ,       { "url": "lib/some_script.js", "method": "squeeze", "except": ["param","customers"] }
      ,       ...
          ]
      ,   "server": [
              { "url": "server.coffee" }
      ,       ...
          ]
      }
    '''
  
  here you include files that are watched for developemnt and minified in build
  
  url:  
    accepted file types:  
      scripts:    js, [coffee](http://jashkenas.github.com/coffee-script/)  
      styles:     css, [less](http://lesscss.org/)  
      templates:  [kup](http://coffeekup.org/)  
      
  method:  
    this is the build method. default is 'mangle'. using [UglifyJS](https://github.com/mishoo/UglifyJS)  
      'mangle': uglify and mangle variable names.  
      'squeeze': uglify without mangling variable names, meaning: variable names will not change in code!  
      'parse': just pass through the parser to check for code validation. no sqeezing or mangling  
      
  except:  
    array of values for variables that shouldn't get mangled.  
    only effective when combined with 'mangle' method.  
    
  !notice!  
  the order of the files in include.json is important!  
  if backbone.js depends upon jquery.js and underscore.js then you must put them in order.  
  recommended order (worked for me all the time...)  
    lib/, client.coffee, models/, collections/, templates/, views/, routers/ and then style/  
  
  -------------
  package.json:  
  
  [npm](http://npmjs.org/) style package.json for the application
    
    '''
      {
          "name": "[APP]"
      ,   ...
      ,   "dependencies": {
              "kassit":">=X.X.X"    
          }
      ,   "devDependencies": {}
      ,   ...
      }
    '''

  -----------
  [APP].html:
  
  this file loads the application by calling [APP].js with a parameter  
  if the parameter is '?dev' then [APP].js loads the files in include.json from 'client.dev'  
  else, if the parameter is '?prod', [APP].js loads the prod.js and prod.css from 'client.prod'  

    <script type="text/javascript" src="[APP].js?dev"></script>
    
  if you wish to load more javascript or stylesheet files manually then ... just do it. (recommended before [APP].js)
  
    <link type="text/css" rel="stylesheet" href="static/some/style.css" />
    <script type="text/javascript" src="static/some/script.js"></script>
    <script type="text/javascript" src="[APP].js?dev"></script>
  
  if you wish (tho, i kinda like the loading script), you can load production files directly by skipping [APP].js in the following mannger
  
    <link type="text/css" rel="stylesheet" href="client.prod/prod.css" />
    <script type="text/javascript" src="client.prod/prod.js"></script>
    
  ---------
  [APP].js:
  
  this is a dual purpose loading script. client-side usage as described at [APP].html section  
  you can use [APP].js as a loader for [express](http://expressjs.com/)-based server  
  
    $ node [APP].js dev
    
  to load in production mode you can load
  
    $ node [APP].js prod
    
  or
  
    $ node server.prod/prod.js

## License 

Copyright (c) 2011 Amit Marcus

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.