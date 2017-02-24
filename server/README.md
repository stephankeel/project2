# Homeautomation-Project Server

## Install required modules
`npm install`

## Configure Database
You may use a mongodb (port 27017) installed locally, on a remote host or by using the mlab mongodb service.

Selecting the database is done by command line argument as follows:
* --db localhost 
* --db hostname or IP-address
* --db mlab --> will use `mongodb://admin:hallihallo62@ds050879.mlab.com:50879/homeautomation`

How to install a mongodb, see https://docs.mongodb.com/manual/administration/install-community/
                                              

## MongoDB Terminal
```
  mongo
  use homeautomation
  show collections
  var schema = db.users.findOne();
  for (var key in schema) { print (key) ; }`
```

## Start the server
Starting the server with continuous building of the typescript files
```
open terminal
change to project2/server folder
npm start
```
Starting the server directly
```
open terminal
change to project2/server folder
node app.js [--help | --db <option> | --admin <password>]
```
Command line attributes:
```
-h, --help              shows this help
-d, --db <option>       see configure database above
-a, --admin <pssword>   creates the user admin, if not yet existing, using the provided password
```


## Debugging the server in Webstrom
* Create a 'node.js' Run-Configuraton. 
  * Choose the current **server** folder as working folder and **app.js** (which initially doesn't exists) as javascript file.
  * Add a **Before Launch** step:  **Compile typescript** and use the tsconfig.js in the server-folder as configuration.


## Just building the server
continuous building, but not starting the server, i.e. for debugging in Webstorm)
```
gulp watch
```

## Testing the REST Interface
Server and test running in one terminal:
* Pre-Condition: Built server.
* Open terminal
* Change to project2/server folder and execute `gulp test`

Optionally you can run the server and the test in dedicated terminal:
* Start the server in one terminal
* Execute `jasmine` or `gulp jasmine` in a 2nd terminal
