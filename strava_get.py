from stravalib.client import Client, unithelper
import json


with open('C:\log.txt') as a:
    code = a.read().splitlines()

codeauth = code

print codeauth

MY_STRAVA_CLIENT_ID = 17090
MY_STRAVA_CLIENT_SECRET = '0f9539d9badcf88fd4a5853a0173f709569c9f6d'

client = Client()

JAMES_TOKEN = client.exchange_code_for_token(client_id=MY_STRAVA_CLIENT_ID,
                                              client_secret=MY_STRAVA_CLIENT_SECRET,
                                          code=codeauth)
client = Client(access_token = JAMES_TOKEN)
athlete = client.get_athlete()

other_athlete = client.get_athlete()
friends = client.get_athlete_friends()


activity = client.get_activity(732084316)

data = {}
data['firstname'] = other_athlete.firstname
json_data = json.dumps(data)

print json_data

# print("type={0.type}, distance={1}, temp={2}, avg cadence={3}, avg speed={4}, kudos={5} start={6} calories={7}".format(activity,
#                                          unithelper.miles(activity.distance),
#                                           activity.average_temp,
#                                             activity.average_cadence,
#                                             unithelper.miles_per_hour(activity.average_speed),
#                                              activity.kudos_count,
#                                                 activity.start_date,
#                                                     activity.calories))

#for a in friends:
    #print ('\n'"{0},{1} {2}".format(a.id, a.firstname, a.lastname))

#for b in friends:
   #print('\n'"{} is your friend.".format(b.firstname + ' ' + b.lastname))

for a in client.get_activities(after = "2015-01-01T00:00:00Z",  limit=0):
    with open('test.json', 'a') as file:
        strava_activity = {}
        strava_activity['Name','Distance'] = a, a.distance
        json_act = json.dumps(strava_activity)
        file.write(json_act)

#for activity in client.get_friend_activities(limit = 20):
#    print('\n'"Name = {0}, distance = {1}".format(activity,unithelper.miles(activity.distance)))