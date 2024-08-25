
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from db.connection import db
## users

users_collection = db['users']

class User(BaseModel):
    username: str
    password: str
    email: str
    created_at:datetime = Field(default=datetime.now())
    updated_at:datetime = Field(default=datetime.now())

    @classmethod
    def add_user (cls,user_data):
        user = cls(**user_data)
        result = users_collection.insert_one(user.model_dump())
        return result
        # return {"message": "The user was already added"}
    
    @classmethod
    def get_user(cls, user_id):
        user_data = users_collection.find_one({"_id":user_id})
        if user_data is not None:
            return user_data
        
    @classmethod
    def verify_user(cls, user_details):
        user_data = users_collection.find_one({"email":user_details["email"],"password":user_details["password"]})
        print(user_data)
        if user_data is not None:
            return {"exists":True,"data":{"id":user_data["_id"].__str__(),"username":user_data["username"],"email":user_data["email"]}}
        
        
        else:
            return {"exists":False,"data":[]}
        
    
    @classmethod
    def update_user(cls,user_id,userUpdate_data):
        result = users_collection.update_one({"_id":user_id},{"$set":userUpdate_data})
        if result is not None:
            return result
        
    @classmethod
    def delete_user(cls,user_id):
        result = users_collection.delete_one({"_id":user_id})
        if result is not None:
            return result
        

    @classmethod
    def check_email_exists(cls, email):
        user_data = users_collection.find_one({"email": email})
        return user_data is not None
    
    @classmethod
    def check_username_exists(cls, username):
        user_data = users_collection.find_one({"username": username})
        return user_data is not None


## location
location_setup_collection = db['location-setup']

class LocationSetup(BaseModel):
    _id: str
    location_id: int
    latitude: float
    longitude: float
    user_id: str
    created_at:datetime = Field(default=datetime.now())
    updated_at:datetime = Field(default=datetime.now())

    @classmethod
    def add_location_data (cls,location_data):
        location = cls(**location_data)
        result = location_setup_collection.insert_one(location.dict())
        return result
    
    @classmethod
    def get_location(cls, location_id):
        location_data = location_setup_collection.find_one({"_id":location_id})
        if location_data is not None:
            return location_data
        
    @classmethod
    def update_location(cls,location_id,locationUpdate_data):
        result = location_setup_collection.update_one({"_id":location_id},{"$set":locationUpdate_data})
        if result is not None:
            return result
        
    @classmethod
    def delete_(cls,location_id):
        result = location_setup_collection.delete_one({"_id":location_id})
        if result is not None:
            return result
        
## soil-data
soil_data_collection = db['soil-data']

class SoilData(BaseModel):
    _id: Optional[str]
    ph: float
    potassium: float
    phosphorus: float
    nitrogen: float
   

    # @classmethod
    # def add_soil_data (cls,soil_data):
    #     soilData = cls(**soil_data)
    #     result = soil_data_collection.insert_one(soilData.dict())
    #     return result
    
    # @classmethod
    # def get_soil (cls, soil_id):
    #     soilData1 = soil_data_collection.find_one({"_id":soil_id})
    #     if soilData1 is not None:
    #         return soilData1
        
    # @classmethod
    # def update_soil(cls,soil_id,soilUpdate_data):
    #     result = soil_data_collection.update_one({"_id":soil_id},{"$set":soilUpdate_data})
    #     if result is not None:
    #         return result
        
    # @classmethod
    # def delete_soil(cls,soil_id):
    #     result = soil_data_collection.delete_one({"_id":soil_id})
    #     if result is not None:
    #         return result

## environmental-data
environmental_data_collection = db['environmental-data']

class EnvironmentalData(BaseModel):
    _id: Optional[str]
    rainfall: float
    humidity: float
    soil_temperature: float
    env_temperature: float

    # @classmethod
    # def add_enviremental_data (cls,environmental_data):
    #     environmentalData = cls(**environmental_data)
    #     result = environmental_data_collection.insert_one(environmentalData.dict())
    #     return result
    
    # @classmethod
    # def get_environmental_data(cls, environmental_id):
    #     environmentalData1= environmental_data_collection.find_one({"_id":environmental_id})
    #     if environmentalData1 is not None:
    #         return environmentalData1
        
    # @classmethod
    # def update_environmental_data(cls,environmental_id,environmentalUpdate_data):
    #     result = environmental_data_collection.update_one({"_id":environmental_id},{"$set":environmentalUpdate_data})
    #     if result is not None:
    #         return result
        
    # @classmethod
    # def delete_environmental_data(cls,environmental_id):
    #     result = environmental_data_collection.delete_one({"_id":environmental_id})
    #     if result is not None:
    #         return result

#fertilizer 
        

## crop
crops_collection = db['crops']


class Crop (BaseModel):
    _id: Optional[str]
    crop_name: str
    image: str
    description: str
    price: float
    category:str
    food_type:str
    planting_season:str
    harvesting_season:str
    soil_data:dict
    # soil_data:Optional[SoilData]
    # environment_data:Optional[EnvironmentalData]

    @classmethod
    def add_crop (cls,crop_data):
        crop = cls(**crop_data)
        result = crops_collection.insert_one(crop.dict())
        return result
    
    @classmethod
    def get_crop (cls, crop_id):
        crop_data= crops_collection.find_one({"_id":crop_id})
        if crop_data is not None:
            return crop_data
        
    @classmethod
    def get_all_crops(cls):
        crop_data = crops_collection.find()
        if crop_data is not None:
            return [cls(**crop).model_dump() for crop in crop_data]
        else:
            return []
        
    @classmethod
    def update_crop(cls,crop_id,cropUpdate_data):
        result = crops_collection.update_one({"_id":crop_id},{"$set":cropUpdate_data})
        if result is not None:
            return result
        
    @classmethod
    def delete_crop (cls,crop_id):
        result = crops_collection.delete_one({"_id":crop_id})
        if result is not None:
            return result

## recommendation
recommendation_collection = db['recommendation']

class Recommendation(BaseModel):
    _id:Optional[str]
    recommendation_type: str
    recommendation:list
    recommendation_description: Optional[str]
    soil_data: dict
    user_id:str
    environmental_data: Optional[dict]
    created_at:datetime = Field(default=datetime.now())
    updated_at:datetime = Field(default=datetime.now())


    @classmethod
    def add_recommendation(cls,recommendation_data):
        recommendation = cls(**recommendation_data)
        result = recommendation_collection.insert_one(recommendation.dict())
        return result
    
    @classmethod
    def get_recommendation(cls, recommendation_id):
        recommendation_data = recommendation_collection.find_one({"_id":recommendation_id})
        if recommendation_data is not None:
            return recommendation_data
        
    @classmethod
    def get_all_recommendation(cls,user_id:str):
        recommendation_data = recommendation_collection.find({"user_id":user_id})
        if recommendation_data is not None:
            return [cls(**recommendation).model_dump() for recommendation in recommendation_data]
        else:
            return []
        
    @classmethod
    def update_recommendation(cls,recommendation_id,recommendationUpdate_data):
        result = recommendation_collection.update_one({"_id":recommendation_id},{"$set":recommendationUpdate_data})
        if result is not None:
            return result
        
    @classmethod
    def delete_recommendation(cls,recommendation_id):
        result = recommendation_collection.delete_one({"_id":recommendation_id})
        if result is not None:
            return result


fertilizer_collection = db['fertilizer']

class Fertilizer(BaseModel):
    _id: str
    fertilizer_name: str
    recommendation_id: str
    user_id: str
    location_id: str  # Reference to the location setup
    crop_id: str  # Reference to the crop data
    fertilizer_type: str
    quantity: float
    unit: str  # e.g., 'kg', 'lbs'
    price_per_unit: float  # Price per unit of fertilizer
    description: str  # Detailed description of the fertilizer
    applied_on: datetime 
    created_at: datetime = Field(default=datetime.now())
    updated_at: datetime = Field(default=datetime.now())




    @classmethod
    def add_fertilizer (cls,fertilizer_data):
        fertilizerData = cls(**fertilizer_data)
        result = fertilizer_collection.insert_one(fertilizerData.dict())
        return result
    
    @classmethod
    def get_fertilizer (cls, fertilizer_id):
        fertilizerData1 = soil_data_collection.find_one({"_id":fertilizer_id})
        if fertilizerData1:
            return fertilizerData1
        
    @classmethod
    def get_all_fertilizers(cls):
        fertilizer_data = fertilizer_collection.find()
        if fertilizer_data is not None:
            return [fertilizer for fertilizer in fertilizer_data ]
        else:
            return []
        
    @classmethod
    def update_fertilizer(cls,fertlizer_id,fertilizerUpdate_data):
        result = fertilizer_collection.update_one({"_id":fertlizer_id},{"$set":fertilizerUpdate_data})
        if result is not None:
            return result
        
    @classmethod
    def delete_fertilizer(cls,fertilizer_id):
        result = fertilizer_collection.delete_one({"_id":fertilizer_id})
        if result is not None:
            return result
        


if __name__ =="__main__":
    for crop in Crop.get_all_crops():
        print(crop)


