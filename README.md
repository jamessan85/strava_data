# Strava Data App

##Overview

###What is the site for?

This site is for people who want to see their strava data in charts and graphs

###What does it do?

Although not quite working it will allow anyone who is a member of the 'club' to login into the strava API and upload their data, they can then see this in the graphs and charts. Currently this has to be done manually. 

###How does it work?

Currently the strava data is returned by storing the auth code that is returned when a user authenticates, this is then passed into another python program that pulls in the required data into a json format, this is then uploaded to MongoDB from where the data can then be accessed through the web using flask. 

##Features

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

##Contributing

### Getting it all up and running
1. Clone this repoistiry using ```git clone <project's Github URL>```
2. You can then use the requirements.txt file to install the required python files using ```pip install .....```
3. If running on localhost you will be able to use the authenticate link on the site, follow the instructions and login to strava, this will grab you authcode and then create a file called activities.json on the C:\ allowing you to upload the data to MongoDB.
4. Make changes if you want to add anything and then upload here when ready. 

##Testing

The first part of the project was to get the users strava data, this has been played around with and was in a seperate python file, but after some testing I moved it into the main strava_data.py file. This now gets the auth code and then creates a json file with all the strava data onto the C: previoulsy the auth code had to be saved and uploaded into the other file. 

Testing has been carried out on a trial and error basis, playing around the with charts until I was happy they were working in the way I wanted. There was an issue with bootstrap that once I manage to sort out I had asked members of the slack community to test the site on their devices and report back on how it looked as a responsive site. 

