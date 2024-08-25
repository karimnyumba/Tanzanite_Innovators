from db.models import Crop
import json

results = Crop.get_all_crops()
results = [{k: v for k, v in crop.items() if k not in ['_id','updated_at','created_at']} for crop in results]
print(results)

with open("crops.json","w") as file:
    json.dump(results, file) 

