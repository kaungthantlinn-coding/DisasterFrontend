import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Crosshair, Plus, Minus } from 'lucide-react';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  selectedLocation?: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  height?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  selectedLocation,
  height = "400px",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Reverse geocoding function (mock implementation)
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      // In a real application, you would use a geocoding service like:
      // - Google Maps Geocoding API
      // - Nominatim (OpenStreetMap)
      // - Mapbox Geocoding API
      
      // Mock implementation for demonstration
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        return data.display_name;
      } else {
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  // Map initialization
  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [39.8283, -98.5795], // Center of US
      zoom: 4,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
      boxZoom: true,
      keyboard: true,
      dragging: true,
      zoomControl: false, // We'll add custom controls
      attributionControl: true,
      fadeAnimation: true,
      zoomAnimation: true,
      markerZoomAnimation: true,
    });
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      minZoom: 1,
    }).addTo(map);

    // Add click handler for location selection
    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      
      // Remove existing marker
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }

      // Add new marker
      const marker = L.marker([lat, lng]).addTo(map);
      markerRef.current = marker;

      // Get address through reverse geocoding
      const address = await reverseGeocode(lat, lng);
      
      // Call the callback with location data
      onLocationSelect(lat, lng, address);
    });

    // Enable scroll wheel zoom after map is ready
    map.whenReady(() => {
      map.scrollWheelZoom.enable();
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onLocationSelect]);

  // Update marker when selectedLocation changes
  useEffect(() => {
    if (selectedLocation && mapInstanceRef.current) {
      // Remove existing marker
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
      }

      // Add marker at selected location
      const marker = L.marker([selectedLocation.lat, selectedLocation.lng]).addTo(mapInstanceRef.current);
      markerRef.current = marker;

      // Center map on selected location
      mapInstanceRef.current.setView([selectedLocation.lat, selectedLocation.lng], 12);
    }
  }, [selectedLocation]);

  // Get current location with improved error handling
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser. Please click on the map to select a location.');
      return;
    }

    // Check if we're on HTTPS or localhost
    const isSecureContext = window.isSecureContext || window.location.hostname === 'localhost';
    
    if (!isSecureContext) {
      alert('Geolocation requires a secure connection (HTTPS). Please click on the map to select a location manually.');
      return;
    }

    setIsGettingLocation(true);

    try {
      // Check permissions first
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        if (permission.state === 'denied') {
          alert('Location access is denied. Please enable location permissions in your browser settings and try again.');
          return;
        }
      }

      // Try to get location with multiple fallback options
      const options = [
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 900000 }
      ];

      for (let i = 0; i < options.length; i++) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, options[i]);
          });
          
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });

          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 12);
            
            // Add a marker for current location
            if (markerRef.current) {
              mapInstanceRef.current.removeLayer(markerRef.current);
            }
            const marker = L.marker([latitude, longitude]).addTo(mapInstanceRef.current);
            markerRef.current = marker;
            
            // Get address and call onLocationSelect
            const address = await reverseGeocode(latitude, longitude);
            onLocationSelect(latitude, longitude, address);
          }
          
          console.log('Location obtained successfully:', { latitude, longitude });
          return; // Success, exit the function
        } catch (error) {
          const geolocationError = error as GeolocationPositionError;
          const errorDetails = {
            code: geolocationError.code,
            message: geolocationError.message,
            type: geolocationError.constructor.name,
            fullError: JSON.stringify(geolocationError, Object.getOwnPropertyNames(geolocationError))
          };
          console.warn(`Geolocation attempt ${i + 1} failed:`, errorDetails);
          if (i === options.length - 1) {
            throw error; // Last attempt failed, throw the error
          }
        }
      }
    } catch (error) {
      const geolocationError = error as GeolocationPositionError;
      const errorDetails = {
        code: geolocationError.code,
        message: geolocationError.message,
        type: geolocationError.constructor.name,
        fullError: JSON.stringify(geolocationError, Object.getOwnPropertyNames(geolocationError))
      };
      console.error('All geolocation attempts failed:', errorDetails);
      
      let errorMessage = 'Unable to get your current location. ';
      
      if (geolocationError.code) {
        switch (geolocationError.code) {
          case 1: // PERMISSION_DENIED
            errorMessage += 'Location access was denied. Please enable location permissions in your browser settings.';
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage += 'Location information is unavailable. This may be due to network connectivity issues or your device\'s location services being disabled.';
            break;
          case 3: // TIMEOUT
            errorMessage += 'Location request timed out. Please ensure you have a stable internet connection and try again.';
            break;
          default:
            errorMessage += 'An unknown error occurred while retrieving your location.';
            break;
        }
      } else {
        errorMessage += 'There was a problem accessing your device\'s location services.';
      }
      
      errorMessage += '\n\nYou can still click anywhere on the map to manually select a location.';
      alert(errorMessage);
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Manual zoom functions
  const zoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className="relative">
      {/* Instructions */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <MapPin size={20} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">How to select location:</p>
            <p className="text-sm text-blue-700 mt-1">
              Click anywhere on the map to drop a pin and select the disaster location. You can also use your current location as a starting point.
            </p>
            <p className="text-xs text-blue-600 mt-2">
              <strong>Note:</strong> If the "Get current location" button doesn't work, this may be due to browser security settings or network issues. Manual selection by clicking on the map works perfectly.
            </p>
          </div>
        </div>
      </div>

      {/* Current location indicator */}
      {currentLocation && (
        <div className="absolute top-4 left-4 z-10 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium">
          <div className="flex items-center space-x-2">
            <Crosshair size={14} />
            <span>Your Location</span>
          </div>
        </div>
      )}

      {/* Map controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        {/* Zoom controls */}
        <button
          onClick={zoomIn}
          className="w-10 h-10 bg-white text-gray-700 rounded-lg shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          title="Zoom in"
        >
          <Plus size={16} />
        </button>
        
        <button
          onClick={zoomOut}
          className="w-10 h-10 bg-white text-gray-700 rounded-lg shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          title="Zoom out"
        >
          <Minus size={16} />
        </button>

        {/* Location button */}
        <button
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className={`w-10 h-10 bg-white text-gray-700 rounded-lg shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center ${
            isGettingLocation ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title={isGettingLocation ? 'Getting your location...' : 'Get current location'}
        >
          {isGettingLocation ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
          ) : (
            <Crosshair size={16} />
          )}
        </button>
      </div>

      {/* Map container */}
      <div
        ref={mapRef}
        style={{
          height,
          width: '100%',
          touchAction: 'pan-x pan-y',
          zIndex: 1
        }}
        className="rounded-xl border border-gray-200 relative cursor-crosshair"
        onWheel={(e) => {
          // Prevent page scroll when zooming on map
          e.stopPropagation();
        }}
      />
    </div>
  );
};

export default LocationPicker;
