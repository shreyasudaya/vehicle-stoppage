import { useEffect, useState } from "react";
import './App.css';
import { MapContainer, TileLayer, Polyline,Popup,Marker } from "react-leaflet";
import geopoints from "./geo-location.json";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

//icon for stoppages
const customIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', // Default Leaflet icon URL
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', // URL to the marker shadow image
  shadowSize: [41, 41] // Size of the shadow
});

let cursor=0;
function App() {
  const [currentTrack, setCurrentTrack] = useState({});
  
  useEffect(() => {
    setCurrentTrack(geopoints[cursor]);

    const interval = setInterval(() => {
      if (cursor === geopoints.length - 1) {
        cursor = 0;
        setCurrentTrack(geopoints[cursor]);
        return;
      }

      cursor += 1;
      setCurrentTrack(geopoints[cursor]);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const markers = geopoints
  .filter(point => point.speed === 0)
  .map((point, index) => {
    const time = new Date(point.eventGeneratedTime).toLocaleString();
    return (
      <Marker key={index} position={[point.latitude, point.longitude]} icon={customIcon}>
        <Popup>
          <p><b>Stoppage {index + 1}</b></p>
          <ul>
            <li>Latitude: {point.latitude}</li>
            <li>Longitude: {point.longitude}</li>
            <li>Time: {time}</li>
          </ul>
        </Popup>
      </Marker>
    );
  });
  const polylinePoints = geopoints.map(point => [point.latitude, point.longitude]);

  return (
    <div>
      <MapContainer
        style={{ height: "calc(100vh - 52px)" }}
        center={[13.01516242, 74.96462775]}
        zoom={11}
        minZoom={0}
        dragging={true}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={polylinePoints} color="red" />
        {markers}

      </MapContainer>
    </div>
  );
}

export default App;
