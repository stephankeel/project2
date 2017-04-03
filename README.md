# Homeautomation-Project Starter

## Install instructions
```
npm install 
```
Installs the packages of the client and the server

## How to start
Please see (build the client first, then start the server)
+ Client: https://github.com/dleuenbe/project2/blob/master/client/README.md
+ Server: https://github.com/dleuenbe/project2/blob/master/server/README.md

## Description
This project is build in the context of the CAS Frontend Engineering at the HSR in 2016/2017.

## Client
The client is a angular 4 app, which is build with angular-cli. The output of the "ng build" command is the public folder in the server directory.
Please read the client's readme for more details, see https://github.com/dleuenbe/project2/blob/master/client/README.md

## Server
The server is a node.js/express server which is written in typescript. How to setup the server is documented in its readme, see
https://github.com/dleuenbe/project2/blob/master/server/README.md

## User Tests
We have done Enduser Tests with my wife, to find the UI problems.
 
## Tips
Install **Mardown support** plugin in webstorm to the see a preview of this file (file -> settings -> plugins, search for 'Markdown support', click *search in repository*, install, restart webstorm)

## Open Issues
+ Database housekeeping is not yet implemented
+ SSL Certificates for intranet site is are not easy maintainable, because all devices must accept the self-signed certificate, so we don't use ssl.
+ Shrinkwrap does not work in the client, because of unmeet dependencies about angular 4.0
