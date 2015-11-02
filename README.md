Installing the Add-in
=====================
Prerequisites
-------------
* CIC 2016r1 or later

Deploy Add-in
-------------
See http://help.inin.com/developer/cic/docs/connectaddin/tutorial-03-deployment.html for the latest deployment instructions.  

Copy the src/jabra folder into your /client/addins directory and in the addins.json file, set the baseUrl to jabra.


Developing Locally
==================
Configuring Interaction Connect Proxy
-------------------------------------
So that everything can be run locally without actually setting up the Interaction Connect app on the dev machine, a reverse proxy will serve up a remote client and the local addin.

edit development_config.json and change the value of the connectUrl to point to an installed instance of Interaction Connect.

Running the Server Locally
--------------------------
Execute

    npm start

to start the server.  Then open a web browser and go to http://localhost:8888

Unit Testing
------------
to run Karma execute

    karma start

code coverage can be found at
coverage/Chrome\ 42.0.2311\ \(Mac\ OS\ X\ 10.10.3\)/index.html
