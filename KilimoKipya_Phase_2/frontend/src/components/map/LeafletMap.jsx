import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "./../../../node_modules/leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";
import pin from './../../assets/pin.png';

function LeafletMap({
  width = "w-screen",
  height = "h-screen",
  showSearchBox = true,
  latitude,
  longitude,
  setLatitude,
  setLongitude,
  setLocationName, // Pass this function to store the location name
}) {
  const searchControl = useMemo(() => new GeoSearchControl({
    provider: new OpenStreetMapProvider(),
    style: "bar",
    notFoundMessage: "Sorry, that address could not be found.",
    autoCompleteDelay: 250,
    retainZoomLevel: true,
    animateZoom: true,
  }), []);

  function AddSearchControlToMap() {
    const map = useMap();
    
    useEffect(() => {
      // Add the search control to the map
      map.addControl(searchControl);
      
      // Listen to the search box result event
      map.on('geosearch/showlocation', (result) => {
        const { x, y, label } = result.location;
        console.log(`Searched Location: Latitude ${y}, Longitude ${x}, Label: ${label}`);
        
        // Update the latitude, longitude, and locationName states
        setLatitude(y);
        setLongitude(x);
        setLocationName(label);
      });

      return () => {
        map.removeControl(searchControl);
      };
    }, [map]);

    return null;
  }

  function LocationPicker() {
    const map = useMap();

    useMapEvents({
      click: async (event) => {
        const { lat, lng } = event.latlng;
        console.log(`Selected Location: Latitude ${lat}, Longitude ${lng}`);
        setLatitude(lat);
        setLongitude(lng);

        // Fetch location name using reverse geocoding API
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
        );
        const data = await response.json();
        
        const locationName = data.display_name || "Unknown location";
        console.log(`Location Name: ${locationName}`);

        // Set the location name
        setLocationName(locationName);
      },
    });

    return null;
  }

  const searchBox = useMemo(() => {
    return <AddSearchControlToMap />;
  }, []);

  return (
    <MapContainer
      className={`${width} ${height}`}
      center={[latitude, longitude]}
      zoom={13}
      scrollWheelZoom={true}
    >
      {showSearchBox && searchBox}
      {showSearchBox && <LocationPicker />}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[latitude, longitude]}
        icon={
          new L.Icon({
            iconUrl: pin,
            iconSize: [20, 30],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          })
        }
      >
        <Popup>{`Location: ${latitude}, ${longitude}`}</Popup>
      </Marker>
    </MapContainer>
  );
}

export default LeafletMap;
