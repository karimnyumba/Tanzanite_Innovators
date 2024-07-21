import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Rectangle } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { useState, useEffect, useRef, useMemo, useContext } from "react";
import { Button, Center, Space, Stack, Text, Title as Title2 } from "@mantine/core";
import L, { LatLng } from "leaflet";
import { useMediaQuery } from "@mantine/hooks";
import { Title } from "chart.js";
import { LocationContext } from "@/pages/fertilizer";

import { LatLngTuple } from 'leaflet';
import { IconWorld } from "@tabler/icons-react";

function LocationMarker() {
  const [draggable, setDraggable] = useState(false)
  const [loader, setLoader] = useState(false)
  const [locationDetails, setLocationDetails] = useState<Record<string, any> | null>(null)
  const [position, setPosition] = useState<LatLng>([-6.121537, 34.719458] as unknown as LatLng)
  const { globalLocation, setGlobalLocation } = useContext<any>(LocationContext)
  const icon = L.icon({ iconUrl: "location_icons/marker-icon.png" });
  const isLargeScreen = useMediaQuery(`(min-width: 644px)`);


  // async function getnutrients() {

  //   var response = await fetch(`${url}/data/nutrients?latitude=${position.lat}&longitude=${position.lng}`, {
  //     method: 'GET', }).catch((e)=>{
  //       setLoader(false);
  //         console.log(e)});

  //         if (response){
  //     console.log(position)
  //     var response_json = await response.json()
  //     console.log(response_json)

  //     setDataNutrients(response_json["response"])
  //     setLoader(false); 

  //   }


  // }


  function getLocationDetails() {
    console.log("hapa hapa")
    console.log(position.lng)
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${position.lng},${position.lat}.json?access_token=pk.eyJ1IjoiZ29kc29ubnR1bmdpIiwiYSI6ImNsdjhjazB6cDAxcjYyaXFsaTMzdjV0eWoifQ.iPSTQY-h8G7pB3u7GVktPA`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data)

        if (data["features"].length > 2) {
          setLocationDetails({
            "place": data["features"][0]["text"],
            "region": data["features"][1]["text"],
            "country": data["features"][2]["text"]
          })
        } else {
          setLocationDetails({
            "place": "",
            "region": data["features"][0]["text"],
            "country": data["features"][1]["text"]

          }) // Process the data here
        }
      })
      .catch(error => console.error('Error fetching data: ', error));
  }








  const map = useMapEvents({
    dblclick(e){
      setPosition(e.latlng)
      setGlobalLocation([e.latlng.lat, e.latlng.lng])
    },
    locationfound(e) {
      console.log(e)
      setPosition(e.latlng)

      setGlobalLocation([e.latlng.lat, e.latlng.lng])
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  useEffect(() => {
   
    if (map.getZoom() > 10){
      map.flyTo(globalLocation as LatLng, map.getZoom())
    }
    else{
      map.flyTo(globalLocation as LatLng, 10)
    }
  
    setPosition(new LatLng(globalLocation[0], globalLocation[1]))
  }, [globalLocation])

  const markerRef = useRef(null)
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        console.log((marker as any).getLatLng())
        setPosition((marker as any).getLatLng())
        setGlobalLocation([(marker as any).getLatLng().lat, (marker as any).getLatLng().lng])

        console.log(globalLocation)


      },
    }),
    [],
  )
  return position === null ? null : (
    <Marker

      eventHandlers={{
        click: () => {
          const marker: any = markerRef.current;
          if (marker) {
            marker.closePopup();
          }
        },
        dblclick: () => {
          setLocationDetails(null)
          const marker: any = markerRef.current;
          if (marker) {
            marker.openPopup();
          }
        },
        dragend: () => {
          const marker = markerRef.current
          console.log((marker as any).getLatLng())
          setPosition((marker as any).getLatLng())
          setGlobalLocation([(marker as any).getLatLng().lat, (marker as any).getLatLng().lng])
        }
      }}
      draggable={true}
      ref={markerRef}
      position={position as LatLng}
      icon={icon}>
      <Popup  >
        <Stack p={0} gap={0} m={0}>
          {loader ? <Center><svg className="loader2" viewBox="25 25 50 50">
            <circle className="circle1" r="20" cy="50" cx="50"></circle>
          </svg></Center>
            : locationDetails && <>
              <Title2 order={4} pb="md" style={{ textDecoration: 'underline' }}>Details</Title2>
              <Text p={0} m={0}><strong>Place:</strong> {locationDetails["place"]}</Text>
              <Text p={0} m={0}><strong>Region:</strong> {locationDetails["region"]}</Text>
              <Text p={0} pb="md" m={0}><strong>Country:</strong> {locationDetails["country"]}</Text>
            </>

          }
          <Button bg="#83E819" onClick={() => {
            getLocationDetails()
          }}>Get Location Details</Button>
        </Stack>
      </Popup>
    </Marker>
  )
}


interface BoundingBoxProps {
  center: LatLngTuple;
}

const BoundingBox: React.FC<BoundingBoxProps> = ({ center }) => {
  const metersToDegrees = (meters: number, latitude: number) => {
    const earthRadius = 6378000; // in meters
    const latOffset = meters / 111320; // meters to degrees for latitude
    const lngOffset = meters / (111320 * Math.cos((latitude * Math.PI) / 180)); // meters to degrees for longitude
    return { latOffset, lngOffset };
  };

  const { latOffset, lngOffset } = metersToDegrees(30, center[0]);

  const bounds: LatLngTuple[] = [
    [center[0] - latOffset, center[1] - lngOffset],
    [center[0] + latOffset, center[1] + lngOffset]
  ];

  return (
    <Rectangle
      bounds={bounds}
      pathOptions={{ color: 'orange', fillColor: 'orange', fillOpacity: 0.2 }}
    />
  );
};


const MapComponent: React.FC = () => {

  const [location, setLocation] = useState([-6.121537, 34.719458]);
  const { globalLocation, setGlobalLocation } = useContext<any>(LocationContext)


  function updateLocation() {

    if ('geolocation' in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setGlobalLocation([latitude, longitude]);
        console.log([latitude, longitude])

      })

    }

  }

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <MapContainer attributionControl={false} center={[location[0], location[1]]} zoom={6} style={{ height: '100%', width: '100%', border: '1px solid gray', borderRadius: "10px" }}>
        <TileLayer

          url="https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ29kc29ubnR1bmdpIiwiYSI6ImNsdjhjazB6cDAxcjYyaXFsaTMzdjV0eWoifQ.iPSTQY-h8G7pB3u7GVktPA" />
        <LocationMarker />
        <BoundingBox center={globalLocation as LatLngTuple} />
      </MapContainer>
      <Center py="md">
      <Button  color="#83E819" onClick={updateLocation}>Locate Me <Space w="2px"/> <IconWorld/></Button>
      </Center>
    </div>
 
  );
};

export default MapComponent; 