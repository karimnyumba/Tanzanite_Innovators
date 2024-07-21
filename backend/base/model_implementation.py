import asyncio
import httpx
import joblib as jb
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import numpy as np
import catboost
import pandas as pd
import json

# Path to the JSON file
json_file_path = 'data/data.json'

# Open the JSON file and convert its content to a dictionary
with open(json_file_path, 'r') as file:
    dictionary = json.load(file)


def check_word_inclusion(word1, word2):
    # Convert both words to lowercase
    word1 = word1.lower()
    word2 = word2.lower()

    # Check if word2 is in word1
    if word2 in word1:
        return True

    # Calculate the percentage of word2 in word1, considering order
    word1_index = 0
    matches = 0

    for char in word2:
        # Find the next occurrence of the character in word1
        while word1_index < len(word1) and word1[word1_index] != char:
            word1_index += 1

        # If we found a match, increment matches and move to next character in word1
        if word1_index < len(word1):
            matches += 1
            word1_index += 1
        else:
            # If we've reached the end of word1, stop searching
            break

    percentage = (matches / len(word2)) * 100

    # Return True if percentage is more than 90, False otherwise
    return percentage > 90


async def get_district_and_region(latitude, longitude):
    async with httpx.AsyncClient(timeout=None) as client:
        url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={latitude}&lon={longitude}"
        response = await client.get(url)
        data = response.json()
        print(data["address"])

        if "state" in data["address"].keys():
            if 'state_district' in data["address"].keys():
                    return data["address"]["state_district"], data["address"]["state"]
            else: 
                return "", data["address"]["state"]

        elif "city" in data["address"].keys():
            return data["address"]["city_district"], data["address"]["city"]
        
        elif "region" in data["address"].keys():
            print("heree")
            if 'state_district' in data["address"].keys():
                    return data["address"]["state_district"], data["address"]["region"]
            
            else: 
                return "", data["address"]["region"]



def get_crops_regional(district, region):
    for value in dictionary:

        if check_word_inclusion(region,  value["region"]):
            print(value)
            region_crops = set()
            for district_value in value["districts"]:
                region_crops.update(district_value["crops"])
                if check_word_inclusion(district,  district_value["district"]):
                    return district_value["crops"]
            return list(region_crops)


crop_scaler: StandardScaler = jb.load(f"models/crop/scaler.joblib")
crop_model: RandomForestClassifier = jb.load(f"models/crop/modelv1.joblib")

fertilzer_preprocessor = jb.load(f"models/fertilizer/preprocessor.joblib")
fertilizer_model: RandomForestClassifier = jb.load(
    f"models/fertilizer/modelv1.joblib")


crop_scaler_v3: StandardScaler = jb.load("models/new_crop/scalerv3.pkl")
crop_preprocessor_v3 = jb.load("models/new_crop/preprocessorv3.pkl")
crop_classifier_v3 = jb.load("models/new_crop/classiferv3.pkl")
crop_regressor_v3 = jb.load("models/new_crop/regressorv3.pkl")


# explainer = shap.TreeExplainer(crop_model)


def predict_crop(N, P, K, ph, temperature, humidity, rainfall):
    # data_scaled = scaler.transform(d"N"], data["P"], data["K"], data["temperature"], data["humidity"],
    #                                data["ph"], data["rainfall"])
    # data_scaled = scaler.transform(.reshape(1,-1))
    data_array = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
    print(data_array)
    data_scaled = crop_scaler.transform(data_array)
    print(data_scaled)
    prediction = crop_model.predict_proba(data_scaled)
    # explanation = explainer(data_scaled)
    # print("explanation")
    # print(explanation)
    output = [{"crop": crop_model.classes_[index].capitalize(), "confidence": round(
        value * 100, 2)} for index, value in enumerate(prediction[0])]
    output.sort(key=lambda x: x["confidence"], reverse=True)
    return output


def predict_fertilizer(temperature, humidity, moisture, soil_type, crop_type,
                       nitrogen, potassium, phosphorous):

    row_dict = {'Soil Type': soil_type, 'Crop Type': crop_type, 'Temparature': temperature, 'Humidity ': humidity, 'Moisture': moisture,
                'Nitrogen': nitrogen, 'Potassium': potassium, 'Phosphorous': phosphorous}

    row_df = pd.DataFrame([row_dict])
    transformed_data = fertilzer_preprocessor.transform(row_df)
    columns_to_encode = ['Soil Type', 'Crop Type']
    columns_to_scale = [
        col for col in row_df.columns if col not in columns_to_encode]
    # Convert the transformed data to a DataFrame
    columns_encoded = fertilzer_preprocessor.named_transformers_[
        'onehot'].get_feature_names_out(columns_to_encode)
    columns_scaled = columns_to_scale
    columns_transformed = columns_scaled + list(columns_encoded)
    data_transformed = pd.DataFrame(
        transformed_data, columns=columns_transformed)

    prediction = fertilizer_model.predict_proba(data_transformed)
    output = [{"fertilizer": fertilizer_model.classes_[index].capitalize() if fertilizer_model.classes_[index] != "10/26/2026" else "10-26-26", "confidence": round(value * 100, 2),
               "confidence_range": "high" if value >= 0.7 else ("medium" if 0.4 <= value < 0.7 else "low")} for index, value in enumerate(prediction[0])]
    output.sort(key=lambda x: x["confidence"], reverse=True)
    return output


async def predict_crop_new(N, P, K, ph, bulk_density, cation_exchange, latitude, longitude):
    # data_scaled = scaler.transform(d"N"], data["P"], data["K"], data["temperature"], data["humidity"],
    #                                data["ph"], data["rainfall"])
    # data_scaled = scaler.transform(.reshape(1,-1))
    try:
        district, region = await get_district_and_region(latitude, longitude)
        print(district, region)
        crops = get_crops_regional(district, region)
        crops_model_accepts = ["Maize", "Rice", "Sorghum", "millet", "Sugarcane"]
        output = []
        for index, value in enumerate(crops):
            if value in crops_model_accepts:
                data_array_2 = np.array(
                    [[N, P, K, ph, bulk_density, cation_exchange, value.lower()]])
                df_2 = pd.DataFrame(data_array_2, columns=[
                    'nitrogen', 'phosphorus', 'potassium', 'ph', 'bulk_density', 'cation_exchange', "CROP"])
                X = crop_preprocessor_v3.transform(df_2)

                numerical_features = [
                    'nitrogen', 'phosphorus', 'potassium', 'ph', 'bulk_density', 'cation_exchange']
                categorical_features = crop_preprocessor_v3.named_transformers_[
                    'cat'].get_feature_names_out(["CROP"])
                feature_names = numerical_features + list(categorical_features)
                X_processed = pd.DataFrame(X, columns=feature_names)
                yield_value = crop_regressor_v3.predict(X_processed)
                output.append({"crop": value.capitalize(),
                            "confidence": yield_value[0]})
                
            else:
                output.append({"crop": value.capitalize(),
                            "confidence": -1})
    #     if False:
    #         data_array = np.array([[N, P, K, ph, bulk_density, cation_exchange]])
    #         df = pd.DataFrame(data_array, columns=[
    #             'nitrogen', 'phosphorus', 'potassium', 'ph', 'bulk_density', 'cation_exchange'])
    #         data_scaled = crop_scaler_v3.transform(df)
    #         prediction = crop_classifier_v3.predict_proba(data_scaled)

    #         output = []
    #         for index, value in enumerate(prediction[0]):
    #             if value > 0.1:
    #             crop_name = crop_classifier_v3.classes_[index]
    #             data_array_2 = np.array(
    #                 [[N, P, K, ph, bulk_density, cation_exchange, crop_name]])
    #             df_2 = pd.DataFrame(data_array_2, columns=[
    #                 'nitrogen', 'phosphorus', 'potassium', 'ph', 'bulk_density', 'cation_exchange', "CROP"])
    #             X = crop_preprocessor_v3.transform(df_2)

    #             numerical_features = [
    #                 'nitrogen', 'phosphorus', 'potassium', 'ph', 'bulk_density', 'cation_exchange']
    #             categorical_features = crop_preprocessor_v3.named_transformers_[
    #                 'cat'].get_feature_names_out(["CROP"])
    #             feature_names = numerical_features + list(categorical_features)
    #             X_processed = pd.DataFrame(X, columns=feature_names)
    #             yield_value = crop_regressor_v3.predict(X_processed)
    #             output.append({"crop": crop_name.capitalize(),
    #                            "confidence": yield_value[0]})

        output.sort(key=lambda x: x["confidence"], reverse=True)
    except Exception as e:
        print(f"Exception in crop prediction: {e}")
        output = []
    return output


if __name__ == "__main__":
    # print(predict_crop(1,1,1,1,1,1,1))
    # print(crop_scaler.get_feature_names_out())
    # print(predict_crop_new(0.4,89,5,6.8,1.54,8))
    district, region = asyncio.run(get_district_and_region(-6.1791, 35.7468))
    print(district, region)
    print(get_crops_regional(district, region))
