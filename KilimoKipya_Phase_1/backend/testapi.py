from fastapi.testclient import TestClient
import pytest
from main import app
from base.api import getEnvironmentData, getNPK


client = TestClient(app)

@pytest.mark.asyncio
async def test_is_isda_available():

    data = await getNPK(latitude=-6.880122, longitude=39.160506)

    for key in ["Nitrogen","Potassium","Phosphorus","ph","bulk_density"]:
        assert key in data.keys(), f"Key '{key}' not found in the response"

@pytest.mark.asyncio
async def test_is_openmeteo_available():
    data = await getEnvironmentData(latitude=-6.880122, longitude=39.160506)

    for key in ["temperature","humidity","rainfall"]:
        assert key in data.keys(), f"Key '{key}' not found in the response"



def test_fertilizer_prediction():
    response = client.get("/predict/fertilizer?temperature=29&humidity=100&moisture=60&soil_type=Loamy&crop_type=Sugarcane&nitrogen=35&potassium=67&phosphorous=20")
    values = response.json()
    assert response.status_code == 200
    assert "response" in values.keys()
    assert len(values["response"]) > 1


def test_crop_prediction():
    response = client.get("/predict/crop?N=50&P=100&K=70&ph=9&temperature=25&humidity=50&rainfall=100")
    values = response.json()
    assert response.status_code == 200
    assert "response" in values.keys()
    assert len(values["response"]) > 1

def test_crop_recommendation():
    response = client.get("/recommend/crop?latitude=-6.880122&longitude=39.160506")
    values = response.json()
    assert response.status_code == 200
    assert "response" in values.keys()
    assert len(values["response"]) > 1


def test_fertilizer_recommendation():
    response = client.get("/recommend/fertilizer?soil_type=Loamy&crop_type=Maize&latitude=-6.880122&longitude=39.160506")
    values = response.json()
    assert response.status_code == 200
    assert "response" in values.keys()
    assert len(values["response"]) > 1