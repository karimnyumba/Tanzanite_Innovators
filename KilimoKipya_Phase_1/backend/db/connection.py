## db configuration and connections should be defined here
from pymongo import MongoClient

try:

    client = MongoClient(f"mongodb+srv://admin:D6oJh8bLhza2Nmbj@clusterone.1wsvo3s.mongodb.net/?retryWrites=true&w=majority&appName=ClusterOne")
    # client = MongoClient(f"mongodb://localhost:27017")

    db = client.CropRecommendationDB

    print("Successfully connected to MongoDb")
except Exception as e:
    client = MongoClient(f"mongodb://localhost:27017")
    db = client.CropRecommendationDB
    print("Connection to MongoDb failed:", e)