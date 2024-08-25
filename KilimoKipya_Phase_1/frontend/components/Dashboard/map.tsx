import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { useState, useEffect, useRef, useMemo, useContext } from "react";
import { Button, Center, Stack,Text,Title as Title2 } from "@mantine/core";
import L, { LatLng } from "leaflet";
import { useMediaQuery } from "@mantine/hooks";
import { Title } from "chart.js";
import { LocationContext } from "@/pages/dashboard";
import { useScreenHeight } from "../Utils/ScreenHeight";

function LocationMarker() {
  const url = process.env.URL
  const [draggable, setDraggable] = useState(false)
  const [loader,setLoader] = useState(false)
  const [dataNutrients,setDataNutrients] = useState < Record<string, any>|null>(null)
  const [position, setPosition] = useState<LatLng>([-6.121537, 34.719458] as unknown as LatLng)
  const  {location, setLocation} = useContext<any>(LocationContext)
  const icon = L.icon({ iconUrl: "location_icons/marker-icon.png"});
  const isLargeScreen = useMediaQuery(`(min-width: 644px)`);


  async function getnutrients() {

    var response = await fetch(`${url}/data/nutrients?latitude=${position.lat}&longitude=${position.lng}`, {
      method: 'GET', }).catch((e)=>{
        setLoader(false);
          console.log(e)});
      
          if (response){
      console.log(position)
      var response_json = await response.json()
      console.log(response_json)

      setDataNutrients(response_json["response"])
      setLoader(false); 

    }
  }




  const map = useMapEvents({
    click() {
      map.locate()
    },
    locationfound(e) {
      console.log(e)
      setPosition(e.latlng)

      setLocation([e.latlng.lat,e.latlng.lng])
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  const markerRef = useRef(null)
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current 
        console.log((marker as any).getLatLng())
          setPosition((marker as any).getLatLng())
          setLocation([(marker as any).getLatLng().lat,(marker as any).getLatLng().lng])

          console.log(location)
          
        
      },
    }),
    [],
  )
  return position === null ? null : (
    <Marker 
    eventHandlers={{
      click: () => {
        setDataNutrients(null)
      },
      dragend:()=>{
        const marker = markerRef.current 
        console.log((marker as any).getLatLng())
          setPosition((marker as any).getLatLng())
          setLocation([(marker as any).getLatLng().lat,(marker as any).getLatLng().lng])
      }
    }}
    draggable={true}
    ref={markerRef}
    position={position as LatLng} 
    icon={icon}>
      <Popup  >
      <Stack p={0} gap={0} m={0}>
{loader?<Center><svg className="loader2" viewBox="25 25 50 50">
  <circle className="circle1" r="20" cy="50" cx="50"></circle>
</svg></Center>
  :dataNutrients&&<>
  <Title2 order={4} style={{ textDecoration: 'underline' }}>Details</Title2>
  <Text p={0} m={0}><strong>Nitrogen:</strong> {dataNutrients["Nitrogen"]} ppm</Text>
  <Text p={0} m={0}><strong>Potassium:</strong> {dataNutrients["Potassium"]} ppm</Text>
  <Text p={0} m={0}><strong>Phosphorus:</strong> {dataNutrients["Phosphorus"]}  ppm</Text>
  <Text p={0} m={0}><strong>Ph: </strong> {dataNutrients["ph"]} </Text>
  <Text p={0} m={0}><strong>Location: </strong> {dataNutrients["landcover"]} </Text>
  </>
}

<Button m={isLargeScreen?"lg":"sm"} color='#83E819' onClick={()=>{

setLoader(true);
getnutrients()
}}>Get Nutrients</Button>
</Stack>
      </Popup>
    </Marker>
  )
  }

const MapComponent: React.FC = () => {
    
    const [location, setLocation] = useState([-6.121537, 34.719458]);
    const screenHeight = useScreenHeight();
    

    function updateLocation() {
    
        if('geolocation' in navigator) {
            // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                const { latitude, longitude } = coords;
                setLocation([latitude, longitude]);
                console.log([latitude, longitude])
            
            })

        }
  
}
    
      return (
        <div style={{ height:`${screenHeight - 60+ 18 }px`, width: '100%' }}>
        <MapContainer attributionControl={false} center={[location[0],location[1]]} zoom={6} style={{ height: '100%', width: '102%', border: '1px solid gray'}}>
          <TileLayer
          
             url="https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ29kc29ubnR1bmdpIiwiYSI6ImNsdjhjazB6cDAxcjYyaXFsaTMzdjV0eWoifQ.iPSTQY-h8G7pB3u7GVktPA"/>
       <LocationMarker />
        </MapContainer>
        {/* <Button onClick={updateLocation}>Update Location</Button> */}
      </div>
      );
};

export default MapComponent; 