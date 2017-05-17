from stravalib.client import Client, unithelper
import json
import datetime
from pprint import pprint
import requests

file_name = raw_input('Input file name')
with open('C:/' + file_name + '.txt') as a:
    code = a.read().splitlines()

codeauth = code

MY_STRAVA_CLIENT_ID = 17090
MY_STRAVA_CLIENT_SECRET = '0f9539d9badcf88fd4a5853a0173f709569c9f6d'

client = Client()

JAMES_TOKEN = client.exchange_code_for_token(client_id=MY_STRAVA_CLIENT_ID,
                                          client_secret=MY_STRAVA_CLIENT_SECRET,
                                          code=codeauth)

client = Client(access_token = JAMES_TOKEN)
athlete = client.get_athlete()
activity = client.get_activity(16398103)

def ath_data():
    data = {'firstname': athlete.firstname, 'lasttname': athlete.lastname, 'id': athlete.id, 'city': athlete.city, 'friends': athlete.friend_count}
    datafied = str(data)
    json_data = json.dumps(datafied)
    print json_data

def activity_get():
    for activity in client.get_activities(after='2012', limit=0):
        miles = int(unithelper.miles(activity.distance))
        time = str(activity.moving_time)
        start_date = str(activity.start_date)
        year_month = start_date[:10]
        elevation = int(unithelper.feet(activity.total_elevation_gain))
        avg = int(unithelper.miles_per_hour(activity.average_speed))
        max = int(unithelper.miles_per_hour(activity.max_speed))
        data = {'StartDate':year_month, 'RideName':activity.name, 'Distance': miles, 'Time':time, 'Elevation': elevation,'AthleteName': athlete.firstname + ' ' + athlete.lastname, 'StravaID':athlete.id, 'AverageSpeed':avg, 'MaxSpeed': max, 'Kudos': activity.kudos_count }
        json_str = json.dumps(data)
        with open("activities.json", "a") as f:
            f.write(json_str + "\n")

activity_get()