from flask import Flask, render_template, request
from pymongo import MongoClient
from stravalib.client import Client, unithelper
import json
import os

app = Flask(__name__)

# mongo varibales for local server
MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
DBS_NAME = os.getenv('MONGO_DB_NAME', 'strava')

# name of collection in mongo
COLLECTION_NAME = 'strava_test'
COLLECTION_NAME1 = 'strava_code'

MY_STRAVA_CLIENT_ID = 17090
MY_STRAVA_CLIENT_SECRET = '0f9539d9badcf88fd4a5853a0173f709569c9f6d'

COLLECTION_NAME1 = 'strava_code'

collection  = MongoClient(MONGO_URI)[DBS_NAME][COLLECTION_NAME]
collection1  = MongoClient(MONGO_URI)[DBS_NAME][COLLECTION_NAME1]

def activities():
    AUTH_CODE = code()  
    client = Client()
    STORED_TOKEN = client.exchange_code_for_token(client_id=MY_STRAVA_CLIENT_ID,
                                                    client_secret=MY_STRAVA_CLIENT_SECRET,
                                                    code=AUTH_CODE)
    client = Client(access_token=STORED_TOKEN)
    athlete = client.get_athlete()

    for activity in client.get_activities(after='2012', limit=0):
        miles = int(unithelper.miles(activity.distance))
        time = str(activity.moving_time)
        start_date = str(activity.start_date)
        year_month = start_date[:10]
        elevation = int(unithelper.feet(activity.total_elevation_gain))
        avg = int(unithelper.miles_per_hour(activity.average_speed))
        max = int(unithelper.miles_per_hour(activity.max_speed))
        data = {'Start Date':year_month, 'Ride Name':activity.name, 'Distance(Mi)': miles, 'Time':time, 'Elevation (Ft)': elevation, 'Athlete Name': athlete.firstname + ' ' + athlete.lastname, 'Strava ID':athlete.id, 'Average Speed(Mph)':avg, 'Max Speed': max, 'Kudos': activity.kudos_count}
        collection.insert_one(data)

def store_code():
    AUTH_CODE = code()  
    client = Client()
    STORED_TOKEN = client.exchange_code_for_token(client_id=MY_STRAVA_CLIENT_ID,
                                                    client_secret=MY_STRAVA_CLIENT_SECRET,
                                                    code=AUTH_CODE)
    client = Client(access_token=STORED_TOKEN)
    athlete = client.get_athlete()
    user_code = {"strava_code": code(), 'Athlete Name': athlete.firstname + ' ' + athlete.lastname, 'strava id':athlete.id}
    collection1.insert_one(user_code)

def code():
    return request.args.get('code')

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/graphs')
def graphs():
    return render_template('graphs.html')

@app.route("/data")
def strava_data():
    """
        A Flask view to serve the project data from
        MongoDB in JSON format.
        """

    # A constant that defines the record fields that we wish to retrieve.
    FIELDS = {
        '_id': False, 'Strava ID': True, 'Elevation (Ft)': True,
        'Kudos': True, 'Average Speed(Mph)': True,
        'Max Speed': True, 'Ride Name': True, 'Time': True,
        'Start Date': True, 'Distance(Mi)': True, 'Athlete Name': True
    }

    # Open a connection to MongoDB using a with statement such that the
    # connection will be closed as soon as we exit the with statement
    with MongoClient(MONGO_URI) as conn:
        # Define which collection we wish to access
        collection = conn[DBS_NAME][COLLECTION_NAME]
        # Retrieve a result set only with the fields defined in FIELDS
        # and limit the the results to 55000
        projects = collection.find(projection=FIELDS, limit=55000)
        # Convert projects to a list in a JSON object and return the JSON data
        return json.dumps(list(projects))

@app.route('/info')
def info():
    return render_template('info.html')

@app.route('/auth')
def auth():
     return render_template('auth.html')

@app.route('/authgood')
def exchange():
    code()
    activities()
    store_code()
    return render_template('token_exchange.html')    

if __name__ == '__main__':
    app.run()

