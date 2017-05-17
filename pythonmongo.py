import pymongo

def mongo_connect():
    conn = pymongo.MongoClient()
    print "Mongo is connected"
    return conn

conn = mongo_connect()
db = conn['strava']
coll = db.stravanew
results = coll.find({"Athlete Name": "Alex White"})
print results.count()
print coll.count()

