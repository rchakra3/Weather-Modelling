# Weather-Modelling
A visual map of the US showing the changes in weather conditions in real time

CONTENTS
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

MODULES
-------------------

The required dependencies to run the project have been declared in package.json file. Use npm install to install these dependencies.


INSTRUCTIONS TO RUN THE PROJECT
-------------------------------

In order to run the Twitter Sentiment Analyzer locally:

1. Install node.js, socket.io and npm as mentioned in the Tutorial
2. Open the project folder which contains the app.js file
3. Start the server by using the "node app.js" command
4. Open a web browser and go to https://localhost:3000

INTERPRETTING THE RESULTS:
-------------------------------
IMPORTANT NOTE:

1. The weather API is used to query data for upto 50 states at a time and due to this it may take upto 25-30 secs to update.

2. It is advisable not to refresh the browser in that duration.

The page opens with two tab options with the Labels:

1. “Current Weather”
2. ““Forecast””

### 1st Screen: “Current Weather” (Default landing page)

   This screen will be used to display data that has been queried from the weather api by the server in real time and pushed to client from the server.
- VIEW:
	- Map of USA opens uniformly colored grey.
	- Server makes asynch weather API call once the client connects to server.
	- Updates map with colors dependent on temperatures returned by the weather API. Map updated when API call returns.
	- Map shows by default values for capitals of States.
	
- ACTIONS:
	- Clicking on any state will open a Modal.
	- Modal will display: Temperature, Humidity and Wind Speed.
	- These values are returned from the API call and the data is stored on both Client Side as JSON objects and the server side.

### 2nd Screen: “Forecast”

  This screen will display “RAIN PREDICTIONS” for both the weather API and the predictions made by us using Bayesian Classifiers.
- VIEW:
	- Holds rain predictions based on the values sent by the Weather API.
	- State will be colored blue if there rain is predicted for the capital city of the State
	- State will be colored white if there is no chance of rain in the capital city of the State. 
