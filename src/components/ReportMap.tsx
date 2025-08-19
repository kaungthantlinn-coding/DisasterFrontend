import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapProps {
  lat: number;
  lng: number;
  address?: string;
}

export default function ReportMap({ lat, lng, address }: MapProps) {
  // Add error boundary for map component
  try {
    return (
      <div className="h-60 w-full rounded-lg overflow-hidden shadow">
        <MapContainer
          center={[lat, lng]}
          zoom={13}
          className="h-full w-full"
          zoomControl={true}
          attributionControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]}>
            <Popup>{address}</Popup>
          </Marker>
        </MapContainer>
      </div>
    );
  } catch (error) {
    console.warn('Map rendering error:', error);
    return (
      <div className="h-60 w-full rounded-lg overflow-hidden shadow flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-gray-500 mb-2">Map unavailable</div>
          <div className="text-sm text-gray-400">Location: {address || `${lat}, ${lng}`}</div>
        </div>
      </div>
    );
  }
}
