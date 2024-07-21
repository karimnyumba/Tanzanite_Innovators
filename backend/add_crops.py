import os
import pandas as pd
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
from db.models import Crop

# Define a function to get crop names from the DataFrame
def get_crop_names(data):
    return data[['label', 'description', 'price', 'food_type', 'category', 'planting_season', 'harvesting_season','nitrogen','phosphorus','potassium','ph']].drop_duplicates().values.tolist()



# Define a function to add/update crops to the database
def update_crops_to_db(crop_names):
    for crop_name, description, price, food_type, category,planting_season, harvesting_season,nitrogen,phosphorus,potassium,ph in crop_names:
        crop_data = {
            "_id": str(ObjectId()),
            "crop_name": crop_name,
            "image": "",
            "description": description,
            "price": price,       # Add price if available
            "food_type": food_type,
            "category": category,
            "planting_season": planting_season,
            "harvesting_season": harvesting_season,
            "soil_data":{
            "nitrogen": nitrogen,
            "phosphorus": phosphorus,
            "potassium": potassium,
            "pH": ph
            }
        }
        Crop.add_crop(crop_data)

# Path to the input CSV file





# Add crops to the database

    

if __name__ == '__main__':

    data = pd.read_csv("data/extracted_crops_2.csv")

# Get crop names from the DataFrame
    crop_names = get_crop_names(data)
    print(crop_names)
    update_crops_to_db(crop_names)
