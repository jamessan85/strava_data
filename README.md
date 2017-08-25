# Strava Data App

## Overview

### What is the site for?

This site is for people who want to see their strava data in charts and graphs

### What is Strava?

[Strava.com](https://www.strava.com) is a application used by athletes to log and track their runs, bike rides and swims along with a whole host of other activities. Strava has an API that can be used and was used by myself to capture athletes data in a JSON file to allow me use them as graphs.

### What does it do?

Currently a separate feature but it will allow anyone who is a member of the 'club' to login into the strava API and upload their data, they can then see this in the graphs and charts. Currently this has to be done manually.

### How does it work?

The strava athletes data was captured using the strava API, the Strava Data was returned in a JSON format which was then uploaded to MongoDB from where the data can then be accessed through the web using flask.

## Features

### Exisisting Features
- Fully functional charts and graphs that change on the fly, quickly see your information, your own information and other peoples information. Compare yourself against your friends.

### Features to implement
- User base features
	- Would like to allow people to authenticate automatically
	- users's json data to upload to MondoDb automatically.

- dc.js features
	- Create a Max Speed chart	 

## Tech Used
- [dc.js](https://dc-js.github.io/dc.js/)
	- dc.js is used to to create the grapahs

- [d3.js](https://d3js.org/)
	- this works along side dc.js to create the graphs

- [bootstrap](http://getbootstrap.com/)
	- for the responsive layout of the site

- [flask](http://flask.pocoo.org)
	- used for building a web app in python

- [MongoDB](https://www.mongodb.com/)
	- stores the json data retrieved from the strava API

## Contributing

### Getting it all up and running
1. Clone this repositry using ```git clone https://github.com/jamessan85/strava_data```
2. You can then use the requirements.txt file to install the required python files using ```pip install -r requirements.txt```
3. You can then feed in your strava json file using MongoDB. Change the ```MONGO_DB_NAME``` and ```COLLECTION_NAME``` to your required settings in strava_data.py


## Testing
Testing has been carried by colleagues of mine and reported back any issues.  

### Issues Found
- Calender months were over lapping each other in the bar charts preventing some of it from being unreadable.
- Issue was resolved by adding the css value of transform this allowed the text to be easily visible by all users. 
```#chart-line-distance .x.axis text {
    text-anchor: end !important;
    transform: rotate(-45deg);
}
``` 
<br></br>
- Users found view of the charts was not good on mobile devices when viewed in portrait mode.
- Solution was to add a bit of javascript to alert users that they should rotate their device to landscape to get the best viewing experience on mobile devices.
```$( document ).ready(function () {
    if(window.innerHeight > window.innerWidth){
        alert("Please rotate your device, this page is best viewed in landscape!");
    }
});   
```
<br></br>
- The <b>numberDisplay's</b>  were jumping around the page when a different set of data was being used, this was because of the animation it was showing many more digits before selecting the number so this was the reason it would cause the view to jump around.
- .3s was added to the number format so it would show the number with a k to indicate thousands, this prevented the page from jumping around.
```.formatNumber(d3.format(".3s"))```
<br></br>


- Initially I wanted to create a line chart instead of bar charts to so you can easily see the peaks and troughs, unfortauntley due to some of the data being ridden indoors this skewed the data as it was inconsistent and make the line graphs unreadable. 
- The solution for this was to switch the line charts to bar charts as the indoor training did not work well with the line charts


