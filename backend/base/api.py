import json
import httpx
import asyncio
import numpy as np

import asyncio
from datetime import datetime, timedelta

# Get the current date and time
now = datetime.now()

# Subtract one day
previous_day = now - timedelta(days=1)

# Format the date as 'YYYY-MM-DD'
formatted_previous_day = previous_day.strftime('%Y-%m-%d')

# async def get_soil_property(latitude, longitude, property, depth="0-20"):
#     async with httpx.AsyncClient(timeout=None) as client:
#         url = f"https://api.isda-africa.com/v1/soilproperty?key=AIzaSyCruMPt43aekqITCooCNWGombhbcor3cf4&lat={latitude}&lon={longitude}&property={property}&depth={depth}"
#         response = await client.get(url)
#         print(response)
#         print(response.json())
#         result = response.json()["property"][property][0]["value"]["value"]
#         return result
    


async def get_soil_property(latitude, longitude, property, depth="0-20"):
    async with httpx.AsyncClient(timeout=None) as client:
        url = f"https://api.isda-africa.com/v1/soilproperty?key=AIzaSyCruMPt43aekqITCooCNWGombhbcor3cf4&lat={latitude}&lon={longitude}&property={property}&depth={depth}"
        attempts = 3  # Allows for one initial try and one retry
        for attempt in range(attempts):
            response = await client.get(url)
            print(f"Attempt {attempt+1}: HTTP {response.status_code} - {response.text}")
            if response.status_code == 200:
                try:
                    return response.json()["property"][property][0]["value"]["value"]
                except json.JSONDecodeError:
                    print("Failed to decode JSON.")
                    return None
                
            elif response.status_code == 400:
                raise Exception("Status Code 400, probably out of Tanzania")
            elif attempt < attempts - 1:
                print("Failed to fetch data, retrying...")
                await asyncio.sleep(2)  # wait for 2 seconds before retrying
            else:
                print("Failed to fetch data after retrying, stopping.")
                return None


async def getNPK(latitude, longitude):
    properties = [["nitrogen_total","0-20"],["potassium_extractable","0-20"],["phosphorous_extractable","0-20"],["ph","0-20"],["bulk_density","0-20"],["land_cover_2019","0"],["cation_exchange_capacity","0-20"]]
    results = [await get_soil_property(latitude, longitude, property[0],property[1]) for property in properties]
    # results = await asyncio.gather(*tasks)

    return {
        "Nitrogen": results[0],
        "Potassium": results[1],
        "Phosphorus": results[2],
        "ph": results[3],
        "bulk_density":results[4],
        "landcover":results[5],
        "cation_exchange":results[6]
    }



async def getEnvironmentData(latitude=0,longitude=0):
    async with httpx.AsyncClient(timeout=None) as client:
        url = f"https://archive-api.open-meteo.com/v1/archive?latitude={latitude}&longitude={longitude}&start_date=2023-01-01&end_date=2023-12-31&hourly=relative_humidity_2m,soil_moisture_0_to_7cm&daily=temperature_2m_mean,rain_sum&timezone=auto"
        response = await client.get(url)
        data =response.json()
        #print(data)
        temperature = data["daily"]["temperature_2m_mean"]
        relative_humidity = data["hourly"]["relative_humidity_2m"]
        rain = data["daily"]["rain_sum"]
        moisture =  data["hourly"]["soil_moisture_0_to_7cm"]
        return {"temperature":float(round(np.mean(temperature),2)),"humidity":float(round(np.mean(relative_humidity),2)),"rainfall":float(round(np.sum(rain)/3,2)),"moisture":float(round(np.array(moisture).max(),2))}



async def getEnvironmentDataSpecific(latitude=0,longitude=0,start_date=(datetime.now()- timedelta(weeks=4)).strftime('%Y-%m-%d'), end_date=datetime.now().strftime('%Y-%m-%d')):
    async with httpx.AsyncClient(timeout=None) as client:
        print(end_date)
        print(start_date)
        url = f"https://archive-api.open-meteo.com/v1/archive?latitude={latitude}&longitude={longitude}&start_date={start_date}&end_date={end_date}&daily=temperature_2m_mean,rain_sum&timezone=auto"
        response = await client.get(url)
        data =response.json()
        print(data)
        temperature = data["daily"]["temperature_2m_mean"]
        rain = data["daily"]["rain_sum"]
        time = data["daily"]["time"]
        return {"temperature":temperature,"rain":rain,"time":time}
    


if __name__ =="__main__":
     print(asyncio.run(getNPK(-6, 32)))