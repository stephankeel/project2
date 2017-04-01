# Homeautomation-Project Starter

## Install instructions
npm install

## How to start
Please see
+ Server: https://github.com/dleuenbe/project2/blob/master/server/README.md
+ Client: https://github.com/dleuenbe/project2/blob/master/client/README.md

## Description
This project is build in the context of the CAS Frontend Engineering at the HSR in 2016/2017.

## Client
The client is a angular 4 app, which is build with angular-cli. The output of the "ng build" command is the public folder in the server directory.
Please read the client's readme for more details, see https://github.com/dleuenbe/project2/blob/master/client/README.md

## Server
The server is a node.js/express server which is written in typescript. How to setup the server is documented in its readme, see
https://github.com/dleuenbe/project2/blob/master/server/README.md

## Content details
This is the starter project for the server and the client. The following commands are supported:

command | description
------- | ---
**'npm install'** | installs all modules for the starter project, for the server and for the client 
**'npm start'** or **'gulp run-without-client-logs'** | starts the server (see the URL in the console), builds and watch the server files, builds the client files to the appropriate folder on the server and rebuilds if they changed 
**'gulp run-with-client-logs'**  | Does the same as above, but shows the client build logs (from the command 'ng build -w') unordered with the other logs
 
## Tips
Install **Mardown support** plugin in webstorm to the see a preview of this file (file -> settings -> plugins, search for 'Markdown support', click *search in repository*, install, restart webstorm)

## Open Issues
+ Database housekeeping is not yet implemented
+ SSL Certificates for intranet site is are not easy maintainable, because all devices must accept the self-signed certificate, so we don't use ssl.
