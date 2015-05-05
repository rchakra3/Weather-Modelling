CONTENTS OF THIS FILE
---------------------
   
 * Introduction
 * Requirements
 * Recommended modules
 * Instructions to run the project
 * Files created and changes made
 * References

INTRODUCTION
------------

This project is aimed at designing a weather application on the web, which can poll the current weather parameters and display them and also it has the capability to perform predictive modelling using Naive Bayes classification by training the model using the previous years weather trends.
It is achieved using predictive modeling based on Bayesian Classifiers.

Download the tar file and extract project folder. 

REQUIREMENTS
-------------

To run this project node.js should be installed on the system.

Installing Node.js (Ubuntu):
1. Install Dependencies:
	a. sudo apt-get install g++ curl libssl-dev apache2-utils
	b. sudo apt-get install git-core
2. Installing Node.js
	a. git clone git://github.com/ry/node.git
	b. cd node
	c. ./configure
	d. make
	e. sudo make install

RECOMMENDED MODULES
-------------------

The required dependencies to run the project have been declared in apckage.json file. use npm install to install there dependencies.


INSTRUCTIONS TO RUN THE PROJECT
-------------------------------

In order to run the Twitter Sentiment Analyzer the following steps need to be done:

1. Install node.js, socket.io and npm as mentioned in the Tutorial
2. Open the project folder which contains the app.js file
3. Start the server by using the "node app.js" command
4. Open a web browser and go to https://localhost:3000

INTERPRETTING THE RESULTS:
-------------------------------
The page opens with two tab options with the Labels:
1. “LABEL 1”
2. “LABEL 2”
1. 1st Screen: “LABEL 1” (Default landing page)
      This screen will be used to display data that has been queried from the weather api by the server in real time and pushed to client from the server.
      VIEW:
	-> Map of USA opens uniformly colored grey.
	-> Server makes asynch weather API call once the client connects to server.
	-> Updates map with colors dependent on temperatures returned by the weather API. Map updated when API call returns.
	-> Map shows by default values for capitals of States.
      ACTIONS:
	-> Clicking on any state will open a Modal.
	-> Modal will display: Temperature, Humidity and Wind Speed.
	-> These values are returned from the API call and the data is stored on both Client Side as JSON objects and the server side.
2. 2nd Screen: “LABEL 2”
     This screen will display “RAIN PREDICTIONS” for both the weather API and the predictions made by us using Bayes’ Classifiers.
      VIEW:
	-> Opens with two maps of USA this time.
	-> Map on Left will hold rain predictions calculated by us:
		- State will be colored blue if there rain predictions for the capital city of the State
		- State will be colored white if there is no chance of rain in the capital city of the State.
	-> Map on the right will hold rain predictions based on the values sent by the Weather API.
		- State will be colored blue if there rain predictions for the capital city of the State
		- State will be colored white if there is no chance of rain in the capital city of the State. 

FILES CREATED AND CHANGES MADE
------------------------------

1. The app.js file has been changed to listen for tweets from twitter and then calcuate the love and hate statistics and send them to the client
2. The client.socket.io file in javascripts folder in public folder has been changed to include the functionality of displaying these statistics along with the tweets on the client web browser page.

REFERENCES
----------

Node.js - https://nodejs.org/


