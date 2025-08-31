import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Crosshair, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
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
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Reverse geocoding function with better error handling
  // Note: Nominatim has usage policies (https://operations.osmfoundation.org/policies/nominatim/)
  // For production, consider using a commercial service or setting up your own Nominatim instance
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      // Nominatim requires proper headers and has usage limitations
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'DisasterReportApp/1.0 (https://yourdomain.com)',
            'Referer': window.location.origin
          }
        }
      );
      
      // Handle different response statuses
      if (response.status === 403) {
        console.warn('Nominatim geocoding forbidden - likely due to usage limits');
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      }
      
      if (response.status === 429) {
        console.warn('Nominatim geocoding rate limited');
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      }
      
      if (!response.ok) {
        throw new Error(`Geocoding failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.display_name) {
        return data.display_name;
      } else {
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      }
    } catch (error) {
      console.warn('Geocoding failed:', error);
      // Fallback to coordinates only
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  // Map initialization
  useEffect(() => {
    if (!mapRef.current) return;

    // Add a small delay to ensure DOM is ready
    const initializeMap = () => {
      try {
        setMapError(null);
        setIsMapLoaded(false);

        const map = L.map(mapRef.current!, {
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

      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 1,
      });

      tileLayer.addTo(map);

      // Set map as loaded when tiles are ready
      tileLayer.on('load', () => {
        setIsMapLoaded(true);
      });

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

        // Check if this is the same location as selectedLocation
        let address: string;
        if (selectedLocation && 
            Math.abs(selectedLocation.lat - lat) < 0.000001 && 
            Math.abs(selectedLocation.lng - lng) < 0.000001 && 
            selectedLocation.address) {
          // Use the existing address if it's the same location
          address = selectedLocation.address;
        } else {
          // Get address through reverse geocoding
          address = await reverseGeocode(lat, lng);
        }

        // Call the callback with location data
        onLocationSelect(lat, lng, address);
      });

      // Enable scroll wheel zoom after map is ready
      map.whenReady(() => {
        map.scrollWheelZoom.enable();
        setIsMapLoaded(true);
      });

      } catch (error) {
        setMapError('Failed to initialize map. Please refresh the page.');
      }
    };

    // Initialize with a small delay
    const timeoutId = setTimeout(initializeMap, 100);

    return () => {
      clearTimeout(timeoutId);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setIsMapLoaded(false);
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
      
      // Call onLocationSelect with the provided address or fallback to coordinates
      onLocationSelect(
        selectedLocation.lat, 
        selectedLocation.lng, 
        selectedLocation.address || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`
      );
    }
  }, [selectedLocation, onLocationSelect]);



  // Get current location with enhanced error handling and user feedback
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.info('Automatic location detection not available. Please click on the map to select your location.', {
        duration: 3000,
        icon: '📍'
      });
      return;
    }

    setIsGettingLocation(true);

    try {
      // Check permissions first if available
      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: 'geolocation' });
          if (permission.state === 'denied') {
            toast.info('Location access not available. Please click on the map to select your location.', {
              duration: 3000,
              icon: '📍'
            });
            setIsGettingLocation(false);
            return;
          }
        } catch (permError) {
          // Continue with location request anyway
        }
      }

      // Try multiple approaches to bypass potential extension interference
      // Approach 1: Direct call with conservative settings
      const simpleResult = await new Promise<GeolocationPosition | null>((resolve) => {
        const timeoutId = setTimeout(() => {
          resolve(null);
        }, 8000);

        try {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              clearTimeout(timeoutId);
              resolve(position);
            },
            (error) => {
              clearTimeout(timeoutId);
              resolve(null);
            },
            { timeout: 7000, enableHighAccuracy: false, maximumAge: 300000 }
          );
        } catch (syncError) {
          clearTimeout(timeoutId);
          resolve(null);
        }
      });

      if (simpleResult) {
        const { latitude, longitude } = simpleResult.coords;

        setCurrentLocation({ lat: latitude, lng: longitude });

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15);

          if (markerRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current);
          }

          const marker = L.marker([latitude, longitude]).addTo(mapInstanceRef.current);
          markerRef.current = marker;

          try {
            const address = await reverseGeocode(latitude, longitude);
            onLocationSelect(latitude, longitude, address);
            toast.success('Location found successfully!');
          } catch (geocodeError) {
            onLocationSelect(latitude, longitude, `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            toast.success('Location found successfully!');
          }
        }

        setIsGettingLocation(false);
        return;
      }

      // If simple approach failed, try alternative method

      // Approach 2: Try with watchPosition as primary method
      const watchResult = await new Promise<GeolocationPosition | null>((resolve) => {
        let watchId: number | null = null;
        const timeoutId = setTimeout(() => {
          if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
          }
          resolve(null);
        }, 10000);

        try {
          watchId = navigator.geolocation.watchPosition(
            (position) => {
              clearTimeout(timeoutId);
              if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
              }
              resolve(position);
            },
            (error) => {
              clearTimeout(timeoutId);
              if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
              }
              resolve(null);
            },
            { timeout: 8000, enableHighAccuracy: false, maximumAge: 300000 }
          );
        } catch (watchError) {
          clearTimeout(timeoutId);
          resolve(null);
        }
      });

      if (watchResult) {
        const { latitude, longitude } = watchResult.coords;

        setCurrentLocation({ lat: latitude, lng: longitude });

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15);

          if (markerRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current);
          }

          const marker = L.marker([latitude, longitude]).addTo(mapInstanceRef.current);
          markerRef.current = marker;

          try {
            const address = await reverseGeocode(latitude, longitude);
            onLocationSelect(latitude, longitude, address);
            toast.success('Location found successfully!');
          } catch (geocodeError) {
            onLocationSelect(latitude, longitude, `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            toast.success('Location found successfully!');
          }
        }

        setIsGettingLocation(false);
        return;
      }

      // Enhanced geolocation options with better timeout handling and fallback
      const getLocationWithTimeout = (options: PositionOptions): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
          let watchId: number | null = null;
          let resolved = false;

          const timeoutId = setTimeout(() => {
            if (!resolved) {
              resolved = true;
              if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
              }
              reject(new Error('Location request timed out'));
            }
          }, options.timeout || 15000);

          const handleSuccess = (position: GeolocationPosition) => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeoutId);
              if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
              }
              resolve(position);
            }
          };

          const handleError = (error: GeolocationPositionError) => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeoutId);
              if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
              }
              reject(error);
            }
          };

          // Try getCurrentPosition first
          navigator.geolocation.getCurrentPosition(handleSuccess, (error) => {
            // If getCurrentPosition fails quickly, try watchPosition as fallback
            if (!resolved && error.code !== GeolocationPositionError.PERMISSION_DENIED) {
              try {
                watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);
              } catch (watchError) {
                handleError(error); // Use original error if watchPosition also fails
              }
            } else {
              handleError(error);
            }
          }, options);
        });
      };

      // Try multiple strategies for getting location with more conservative timeouts
      const strategies = [
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }, // Fast, cached
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },  // Accurate
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 600000 }  // Very fast fallback
      ];

      let lastError: any = null;

      for (let i = 0; i < strategies.length; i++) {
        try {
          const position = await getLocationWithTimeout(strategies[i]);

          const { latitude, longitude, accuracy } = position.coords;

          setCurrentLocation({ lat: latitude, lng: longitude });

          if (mapInstanceRef.current) {
            // Center map on current location with appropriate zoom
            const zoom = accuracy && accuracy < 100 ? 15 : accuracy && accuracy < 1000 ? 13 : 11;
            mapInstanceRef.current.setView([latitude, longitude], zoom);
            
            // Remove existing marker and add new one
            if (markerRef.current) {
              mapInstanceRef.current.removeLayer(markerRef.current);
            }
            
            const marker = L.marker([latitude, longitude]).addTo(mapInstanceRef.current);
            markerRef.current = marker;
            
            // Get address and call onLocationSelect
            try {
              const address = await reverseGeocode(latitude, longitude);
              onLocationSelect(latitude, longitude, address);
              toast.success('Location found successfully!');
            } catch (geocodeError) {
              // Still call onLocationSelect with coordinates
              onLocationSelect(latitude, longitude, `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
              toast.success('Location found successfully!');
            }
          }

          return; // Success, exit the function
        } catch (error) {
          lastError = error;

          // If this isn't the last strategy, continue to next one
          if (i < strategies.length - 1) {
            continue;
          }
        }
      }

      // All strategies failed, throw the last error
      throw lastError;

    } catch (error) {
      let errorMessage = 'Unable to get your current location. ';

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case GeolocationPositionError.PERMISSION_DENIED:
            errorMessage = 'Location access not available. No worries - just click on the map to select your location!';
            break;
          case GeolocationPositionError.POSITION_UNAVAILABLE:
            errorMessage = 'Location services unavailable. Please click on the map to select your location.';
            break;
          case GeolocationPositionError.TIMEOUT:
            errorMessage = 'Location request timed out. Please click on the map to select your location.';
            break;
          default:
            errorMessage = 'Automatic location detection not available. Please click on the map to select your location.';
            break;
        }
      } else {
        errorMessage = 'Automatic location detection not available. Please click on the map to select your location.';
      }

      // Show user-friendly info message instead of error
      toast.info(errorMessage, {
        duration: 4000,
        icon: '📍'
      });
      
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
    <div className="relative w-full" style={{ position: 'relative' }}>
      {/* Simple Instructions */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <MapPin size={16} className="text-blue-600" />
          <p className="text-sm text-blue-800">
            <strong>Click anywhere on the map</strong> to select the disaster location
          </p>
        </div>
      </div>



      {/* Current location indicator */}
      {currentLocation && (
        <div className="absolute top-4 left-4 z-50 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium">
          <div className="flex items-center space-x-2">
            <Crosshair size={14} />
            <span>Your Location</span>
          </div>
        </div>
      )}

      {/* Map controls */}
      <div
        className="absolute top-4 right-4 z-50 flex flex-col space-y-2"
        style={{
          zIndex: 1000,
          position: 'absolute',
          pointerEvents: 'auto'
        }}
      >
        {/* Zoom controls */}
        <button
          onClick={zoomIn}
          className="w-12 h-12 bg-white text-gray-700 rounded-lg shadow-xl hover:bg-gray-50 transition-colors flex items-center justify-center border border-gray-200"
          title="Zoom in"
          style={{ zIndex: 1000 }}
        >
          <Plus size={18} />
        </button>

        <button
          onClick={zoomOut}
          className="w-12 h-12 bg-white text-gray-700 rounded-lg shadow-xl hover:bg-gray-50 transition-colors flex items-center justify-center border border-gray-200"
          title="Zoom out"
          style={{ zIndex: 1000 }}
        >
          <Minus size={18} />
        </button>

        {/* Location button */}
        <button
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className={`w-12 h-12 bg-white text-gray-700 rounded-lg shadow-xl hover:bg-gray-50 transition-colors flex items-center justify-center border border-gray-200 ${
            isGettingLocation ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title={isGettingLocation ? 'Getting your location...' : 'Try to detect current location (or click on map)'}
          style={{ zIndex: 1000 }}
        >
          {isGettingLocation ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent"></div>
          ) : (
            <Crosshair size={18} />
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
          zIndex: 10,
          minHeight: '400px',
          position: 'relative'
        }}
        className="leaflet-container rounded-xl border border-gray-200 relative cursor-crosshair bg-gray-100"
        onWheel={(e) => {
          // Prevent page scroll when zooming on map
          e.stopPropagation();
        }}
      >
        {/* Loading/Error indicator */}
        {mapError ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 mb-2">⚠️</div>
              <p className="text-sm text-red-600">{mapError}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        ) : !isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
