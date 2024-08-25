from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from base.api import getEnvironmentDataSpecific, getNPK, getEnvironmentData
import asyncio
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from db.models import Recommendation, User, Crop, Fertilizer
from pdf.generate import generate_soil_crop_pdf, generate_soil_fertilizer_pdf
import pandas as pd


from base.model_implementation import predict_crop, predict_crop_new, predict_fertilizer

app = FastAPI()
df = pd.read_csv("data/crop_prices_trend.csv")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


def fetch_crop_price_data(start_date, end_date):
    # List of commodities to include
    commodities = ['Maize', 'Rice', 'Beans', 'Wheat', 'Sorghum', 
                   'Millet (bulrush)', 'Millet (finger)', 'Potatoes (Irish)']

    # Read the CSV file

    # Convert date column to datetime
    df['date'] = pd.to_datetime(df['date'])

    # Filter data based on date range and commodities
    mask = (df['date'] >= start_date) & (df['date'] <= end_date) & (df['commodity'].isin(commodities))
    filtered_df = df.loc[mask]

    # Group by commodity and date, then calculate average price
    grouped_df = filtered_df.groupby(['commodity', 'date'])['price'].mean().reset_index()

    # Round the price to two decimal places
    grouped_df['price'] = grouped_df['price'].round(2)

    # Format the data
    result = {}
    for commodity, group in grouped_df.groupby('commodity'):
        data = group.apply(lambda row: {"x": row['date'].strftime('%Y-%m-%d'), "y": row['price']}, axis=1).tolist()
        result[commodity] = {
            "label": commodity,
            "data": data
        }

    return result



@app.get("/")
def read_root():
    return {"response": "Welcome to Crop Recommendation System Backend"}


@app.get("/user")
def get_user():
    return {}


class UserModel(BaseModel):
    username: str
    password: str
    email: str


@app.post("/user")
def create_user(user: UserModel):

    # check if the user and email exists
    # EMAIL
    if User.check_email_exists(user.email):
        return HTTPException(status_code=400, detail="Email Already Exists")

    if User.check_username_exists(user.username):
        return HTTPException(status_code=400, detail="Username Already Exists")

    try:
        result = User.add_user(user.model_dump())
   
        print(result)
        if result.acknowledged:
            return {"user_id": result.inserted_id.__str__()}

        else:
            return HTTPException(status_code=500, detail="Failed to save the user")
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Database Error: Failed to save the user,Problem:{e}")


@app.put("/user")
def modify_user():
    return {}


@app.delete("/user")
def delete_user():
    return {}


class VerifyModel(BaseModel):
    email: str
    password: str


@app.post("/user/verify")
def verify_user(user_data: VerifyModel):
    response = User.verify_user(user_data.model_dump())

    return response


@app.get("/data/recommendation")
def get_recommendation(recommendation_id: str):
    return {}


@app.get("/data/recommendation/all")
def get_all_recommendation(user_id: str):
    data = Recommendation.get_all_recommendation(user_id)
    crop_count = 0
    fertilizer_count = 0
    for entry in data:
        # Remove updated_at field
        entry.pop('updated_at', None)
        entry['created_at'] = entry['created_at'].strftime('%Y-%m-%d')

        if entry["recommendation_type"] == "crop":
            crop_count += 1
        elif entry["recommendation_type"] == "fertilizer":
            fertilizer_count += 1

        recommend_count = 0
        for value in entry["recommendation"]:
            if value["confidence"] > 0:
                recommend_count += 1

        entry["recommend_count"] = recommend_count

    # Format created_at field to year-month-day
    data.reverse()
    return {"data": data, "crop_count": crop_count, "fertilizer_count": fertilizer_count, "total": len(data)}


@app.post("/data/recommendation")
def post_recommendation(data: Recommendation):
    result = Recommendation.add_recommendation(data.model_dump())
    return {"success": True}


@app.delete("/data/recommendation")
def delete_recommendation():
    return {}


@app.get("/data/nutrients")
async def read_soil(latitude=-6.880122, longitude=39.160506):
    results = await getNPK(latitude, longitude)
    print(results)
    return {"response": results}


@app.get("/data/conditions")
async def read_crop(latitude=-6.880122, longitude=39.160506):
    return {"response": await getEnvironmentData(latitude, longitude)}


@app.get("/data/all_crops")
async def get_all_crops():
    data = []
    for crop in Crop.get_all_crops():
        data.append({"crop": crop["crop_name"], "description": crop["description"],
                     "price": crop["price"], "category": crop["category"],
                     "food_type": crop["food_type"],
                     "planting_season": crop["planting_season"],
                     "harvesting_season": crop["harvesting_season"]})
    return data


@app.get("/data/bestcrops")
async def read_bestcrops():

    return {"response": {"Maize": 30, "Rice": 20, "Beans": 50, "Mangoes": 60},
            "chart_friendly": {"labels": ["Maize", "Rice", "Beans", "Mangoes"],
                               "data": [30, 20, 50, 60]}}


@app.get("/data/topfertilizer")
async def read_topfertilizer():
    return {"response": {"Urea": 30, "17-17-17": 20, "28-28": 50, "14-35-14": 60},
            "chart_friendly": {"labels": ["Urea", "17-17-17", "28-28", "14-35-14"],
                               "data": [30, 20, 50, 60]}}


@app.get("/data/rain_conditions")
async def read_rain(latitude=-6.880122, longitude=39.160506,start_time="",end_time=""):
    if start_time != "":
        data = await getEnvironmentDataSpecific(latitude, longitude,start_time,end_time)
    else:
         data = await getEnvironmentDataSpecific(latitude, longitude)

    rainfall = [{"x": date, "y": amount}
                for date, amount in zip(data["time"], data["rain"])]
    temperature = [{"x": date, "y": amount}
                   for date, amount in zip(data["time"], data["temperature"])]

    return {"response": {
        "rain": rainfall,
        "temperature": temperature
    }}

@app.get("/data/crop_price_tends")
def read_crop_prices(start_time="",end_time=""):
    if start_time !="":
        result = fetch_crop_price_data(start_date=start_time,end_date=end_time)
    else:
        result = fetch_crop_price_data(start_date="2024-01-01",end_date="2024-07-01")
    return result

@app.get("/predict/crop")
def crop_predict_api(N: float, P: float, K: float, ph: float, temperature: float, humidity: float, rainfall: float):
    output = predict_crop(N, P, K, ph, temperature, humidity, rainfall)
    crop_details = {}
    for crop in Crop.get_all_crops():
        crop_details[crop["crop_name"]] = {"description": crop["description"],
                                           "price": crop["price"], "category": crop["category"],
                                           "food_type": crop["food_type"],
                                           "planting_season": crop["planting_season"],
                                           "harvesting_season": crop["harvesting_season"],
                                           "required_nutrients": crop["soil_data"], }
    print(output)
    print(crop_details.keys())
    return {"response":  [{**crop, "details": crop_details[crop["crop"]]} for crop in output]}


@app.get("/predict/fertilizer")
def fertilizer_predict_api(temperature, humidity, moisture, soil_type, crop_type,
                           nitrogen, potassium, phosphorous):
    output = predict_fertilizer(temperature, humidity, moisture, soil_type, crop_type,
                                nitrogen, potassium, phosphorous)

    fertilizer_details = {}
    for fert in Fertilizer.get_all_fertilizers():
        fertilizer_details[fert["fertilizer_name"].lower()] = {"quantity": fert["description"],
                                                               "how_to_use": fert["how_to_use"], "description": fert["description"],
                                                               "maximum_price": fert["maximum_price"],
                                                               "price_range": "high" if fert["maximum_price"] >= 30000 else ("medium" if 10000 <= fert["maximum_price"] < 30000 else "low"),
                                                               "unit": fert["unit"],
                                                               "quantity": fert["quantity"]}
        
    crop_details = {}
    for crop in Crop.get_all_crops():

        crop_details[crop["crop_name"]] = {
            "required_nutrients": crop["soil_data"]}

    if crop_type in ["Ground Nuts", "Tobacco"]:
        required_nutrients = {
            "nitrogen": 0,
            "phosphorus": 0,
            "potassium": 0,
            "pH": 0,
        }

    elif crop_type == "Millets":
        required_nutrients = crop_details["Millet"]["required_nutrients"]

    else:
         required_nutrients = crop_details[crop_type]["required_nutrients"]

    return {"response":  [{**fertilizer,  "details": fertilizer_details[fertilizer["fertilizer"].lower()]} for fertilizer in output],
            "required_nutrients": required_nutrients }


@app.get("/recommend/crop")
async def crop_recommend_api(latitude=-6.880122, longitude=39.160506):
    soil_results = await getNPK(latitude, longitude)

    env_results = await getEnvironmentData(latitude, longitude)
    print(env_results)
    output = predict_crop(N=soil_results["Nitrogen"]*100, P=soil_results["Phosphorus"],
                          K=soil_results["Potassium"], ph=soil_results["ph"],
                          temperature=env_results["temperature"], humidity=env_results["humidity"],
                          rainfall=env_results["rainfall"])

    crop_details = {}
    for crop in Crop.get_all_crops():
        crop_details[crop["crop_name"]] = {"description": crop["description"],
                                           "price": crop["price"], "category": crop["category"],
                                           "food_type": crop["food_type"],
                                           "planting_season": crop["planting_season"],
                                           "harvesting_season": crop["harvesting_season"],
                                           "required_nutrients": crop["soil_data"]}
    print(output)
    return {"response": {
        "output": [{**crop, "details": crop_details[crop["crop"]]} for crop in output],
        "data": {**soil_results, **env_results},
        "measurements": ["g/kg", "ppm", "ppm", "", "g/cm3", "", "", "°C", "%", "mm", "m3"]
    }}


@app.get("/v2/recommend/crop")
async def crop_recommend_api(latitude=-6.880122, longitude=39.160506):
    try:
        soil_results = await getNPK(latitude, longitude)
    except Exception as e:
        print(e)
        raise HTTPException(500, detail="Failed ro get soil data")

    try:
        env_results = await getEnvironmentData(latitude, longitude)
    except Exception as e:
        print(e)
        env_results = {"temperature": "", "humidity": "",
                       "rainfall": "", "moisture": ""}
    print(env_results)
    output = await predict_crop_new(N=soil_results["Nitrogen"], P=soil_results["Phosphorus"],
                                    K=soil_results["Potassium"], ph=soil_results["ph"], bulk_density=soil_results["bulk_density"], cation_exchange=soil_results["cation_exchange"], latitude=latitude, longitude=longitude)

    crop_details = {}
    for crop in Crop.get_all_crops():

        crop_details[crop["crop_name"]] = {"description": crop["description"],
                                           "price": crop["price"], "category": crop["category"],
                                           "food_type": crop["food_type"],
                                           "planting_season": crop["planting_season"],
                                           "harvesting_season": crop["harvesting_season"],
                                           "required_nutrients": crop["soil_data"]}

    print(output)
    return {"response": {
        "output": [{**crop, "details": crop_details[crop["crop"]] if crop["crop"] in crop_details.keys() else {"description": "",
                                                                                                               "price": "", "category": "",
                                                                                                               "food_type": "",
                                                                                                               "planting_season": "",
                                                                                                               "harvesting_season": "",
                                                                                                               "required_nutrients": {
                                                                                                                   "nitrogen": 0,
                                                                                                                   "phosphorus": 0,
                                                                                                                   "potassium": 0,
                                                                                                                   "pH": 0,

                                                                                                               }}} for crop in output],
        "data": {**soil_results, **env_results},
        "measurements": ["g/kg", "ppm", "ppm", "", "g/cm3", "", "", "°C", "%", "mm", "m3"]
    }}


@app.get("/recommend/fertilizer")
async def fertilizer_recommend_api(soil_type: str, crop_type: str, latitude=-6.880122, longitude=39.160506):

    soil_results = await getNPK(latitude, longitude)
    env_results = await getEnvironmentData(latitude, longitude)

    output = predict_fertilizer(env_results["temperature"], env_results["humidity"], env_results["moisture"], soil_type, crop_type,
                                soil_results["Nitrogen"]*100, soil_results["Potassium"], soil_results["Phosphorus"])

    fertilizer_details = {}
    for fert in Fertilizer.get_all_fertilizers():
        fertilizer_details[fert["fertilizer_name"].lower()] = {"quantity": fert["description"],
                                                               "how_to_use": fert["how_to_use"], "description": fert["description"],
                                                               "maximum_price": fert["maximum_price"],
                                                               "price_range": "high" if fert["maximum_price"] >= 30000 else ("medium" if 10000 <= fert["maximum_price"] < 30000 else "low"),
                                                               "unit": fert["unit"],
                                                               "quantity": fert["quantity"]}
    crop_details = {}
    for crop in Crop.get_all_crops():

        crop_details[crop["crop_name"]] = {
            "required_nutrients": crop["soil_data"]}

    if crop_type in ["Ground Nuts", "Tobacco"]:
        required_nutrients = {
            "nitrogen": 0,
            "phosphorus": 0,
            "potassium": 0,
            "pH": 0,
        }

    elif crop_type == "Millets":
        required_nutrients = crop_details["Millet"]["required_nutrients"]

    else:
         required_nutrients = crop_details[crop_type]["required_nutrients"]

    return {"response": {
        "output": [{**fertilizer, "details": fertilizer_details[fertilizer["fertilizer"].lower()]} for fertilizer in output],
        "data": {**soil_results, **env_results},
        "required_nutrients": required_nutrients,
        "measurements": ["g/kg", "ppm", "ppm", "", "g/cm3", "", "", "°C", "%", "mm", "m3"]
    }}


@app.get("/recommendation")
def get_recommendation():
    return {}


@app.delete("/recommendation")
def delete_recommendation():
    return {}


@app.post("/download/pdf/crops")
def get_pdf(data: dict):  # Recommendation):
    print(data)
    value = generate_soil_crop_pdf(data)

    return StreamingResponse(value, media_type='application/pdf', headers={'Content-Disposition': 'attachment; filename="soil_crop.pdf"'})


@app.post("/download/pdf/fertilizer")
def get_pdf(data: dict):  # Recommendation):
    print(data)
    value = generate_soil_fertilizer_pdf(data)

    return StreamingResponse(value, media_type='application/pdf', headers={'Content-Disposition': 'attachment; filename="soil_crop.pdf"'})


