from stravalib.client import Client, unithelper
from flask import Flask, render_template, request
from strava_data import code
from pymongo import MongoClient
import json
import datetime
import os

MY_STRAVA_CLIENT_ID = 17090
MY_STRAVA_CLIENT_SECRET = '0f9539d9badcf88fd4a5853a0173f709569c9f6d'

MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
DBS_NAME = os.getenv('MONGO_DB_NAME', 'strava')
COLLECTION_NAME = 'strava_test'
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
    user_code = {"strava_code": code() }
    collection1.insert_one(user_code)

def activities_schedule():
    array = list(collection1.find({}))
    results = []
    for i in array:
        results.append(i['strava_code'])  
    for r in results:
        client = Client()
        STORED_TOKEN = client.exchange_code_for_token(client_id=MY_STRAVA_CLIENT_ID,
                                                        client_secret=MY_STRAVA_CLIENT_SECRET,
                                                        code=r)
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

#activities_schedule()           