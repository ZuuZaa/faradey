'use client'
import {React, useEffect, useState} from 'react'
 import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

 async function fetchData(){
  const response = await fetch("http://89.40.2.200:3461/api/home/get-map-list");
  const data = await response.json();
  return data.output;
}

const mapContainerStyle = {
  width: '800px',
  height: '400px',
};

const center = {
  lat: 40.425,
  lng: 49.839,
};

// const locationss = [
//   { lat: -3.745, lng: -38.523 },
//   { lat: -5.747, lng: -88.524 },
//   { lat: -6.749, lng: -33.525 },
//   // Diğer konumlar...
// ];

export default function Map() {

  const [locations, setData] = useState([]);
    
    useEffect(() => {
        
      async function fetchDataAsync() {
        
        const fetchedData = await fetchData();
            setData(fetchedData);
        }
  
      fetchDataAsync();
    }, []);
    
  return(
     //<div>map</div>
     <LoadScript googleMapsApiKey="AIzaSyD1itoBDHY27DfUt9mm70Mf4mRPYMAUW_s">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
      >
        {locations.map(loc => (
          <Marker
            key={loc.id} // Make sure 'id' is unique
            position={{ lat: loc.lat, lng: loc.lng }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  )
   

}
