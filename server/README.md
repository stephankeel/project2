# Homeautomation-Project Server

## Install required modules
`npm install`

## Configure Database
You may use a mongodb (port 27017) installed locally, on a remote host or by using the mlab mongodb service.

For security reason, please start the mongodb server with option `--noscripting`.

Selecting the database is done by command line argument as follows:
* `--db localhost`, the default option
* `--db hostname` or `--db IP-address`
* `--db mlab` will use internet based mongo service `mongodb://admin:hallihallo62@ds050879.mlab.com:50879/homeautomation`

How to install a mongodb, see https://docs.mongodb.com/manual/administration/install-community/

We use following mongodb server start script: `"C:\Program Files\MongoDB\Server\3.4\bin\mongod" --noscripting --dbpath .\data`

**Note**, that you need to create the `data` folder in advance!
                                              

## Start the server

If you have not yet setup a user, then you have to start the server directly, providing the `--admin <password>` option to create the initial admin user:
```
open terminal
change to project2/server folder
gulp build
node app.js [--help | --db <option> | --admin <password> | --production]
```
Command line attributes:
```
-h, --help              shows this help
-d, --db <option>       see configure database above
-a, --admin <password>  creates the user admin, if not yet existing, using the provided password
-p, --production        use for production
```
Starting the server with continuous building (requires locally installed mongodb running):
```
open terminal
change to project2/server folder
npm start
```

## Production Mode

In Production Mode, the server will use a public and a private key for jwt token. 
Without the keys, he will not start. To start the server in production mode, either set
the environment variable NODE_ENV to 'production' or start the server with the option '-p'.

* The private.key file must be named '../../ha-key'
* The public.key file must be named '../../ha-key.pub'

To create this key, you can use ssh-keygen -t rsa -b 2048 -f ../../ha-key. Do not enter a passphrase.

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

Running the unit test:
* Pre-Condition: Built server
* Open terminal
* Change to project2/server folder and execute `gulp unittests`

Running integration tests:
* Pre-Condition: Built server, empty database
* Start the server in one terminal with `node app.js --admin 12345678`
* Start the test in an other terminal: `gulp test`
