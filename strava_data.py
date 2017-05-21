from flask import Flask, render_template, request
from pymongo import MongoClient
import json
import os

app = Flask(__name__)

MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
DBS_NAME = os.getenv('MONGO_DB_NAME', 'strava')

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
COLLECTION_NAME = 'stravanew'

def code():
    return request.args.get('code')

def get_code(data):
    file_name = raw_input('Enter file name')
    with open("C:/" + file_name + '.txt', 'a') as text_file:
        text_file.write(data + '\n')

def run():
    data = code()
    get_code(data)


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

@app.route('/auth')
def auth():
    return render_template('auth.html')

@app.route('/authgood')
def exchange():
    run()
    return render_template('token_exchange.html')

@app.route('/info')
def info():
    return render_template('info.html')

if __name__ == '__main__':
    app.run()

