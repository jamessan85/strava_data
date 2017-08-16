# Strava Data App

## Overview

### What is the site for?

This site is for people who want to see their strava data in charts and graphs

### What is Strava?

Strava is a application used by athletes to log and track their runs, bike rides and swims along with a whole host of other activities. Strava has an API that can be used and was used by myself to capture athletes data in a JSON file to allow me use them as graphs.

### What does it do?

Currently a separate feature but it will allow anyone who is a member of the 'club' to login into the strava API and upload their data, they can then see this in the graphs and charts. Currently this has to be done manually.

### How does it work?

Currently the strava data is returned by storing the auth code that is returned when a user authenticates, this is then passed into another python program that pulls in the required data into a json format, this is then uploaded to MongoDB from where the data can then be accessed through the web using flask. 

## Features

### Exisisting Features
- If running on localhost it will save a activities.json file to the C: allowing you to upload to the MongoDB

### Features to implement
- User base features
	- Would like to allow people to authenticate automatically
	- users's json data to upload to MondoDb automatically.

- dc.js features
	- Create a Max Speed chart	 

##Tech Used
- [dc.js]{https://dc-js.github.io/dc.js/}
	- dc.js is used to to create the grapahs

- [d3.js]{https://d3js.org/}
	- this works along side dc.js to create the graphs

- [bootstrap]{http://getbootstrap.com/}
	- for the responsive layout of the site

- [flask]{http://flask.pocoo.org}
	- used for building a web app in python

- [MongoDB]{https://www.mongodb.com/}
	- stores the json data retrieved from the strava API

## Contributing

### Getting it all up and running
1. Clone this repositry using ```git clone https://github.com/jamessan85/strava_data```
2. You can then use the requirements.txt file to install the required python files using ```pip install .....```
3. You can then feed in your strava json file using MongoDB. Change the ```MONGO_DB_NAME``` and ```COLLECTION_NAME``` to your required settings in strava_data.py


## Testing
Testing has been carried out on a trial and error basis, playing around the with charts until I was happy they were working in the way I wanted. There was an issue with bootstrap that once I manage to sort out I had asked members of the slack community to test the site on their devices and report back on how it looked as a responsive site. 

