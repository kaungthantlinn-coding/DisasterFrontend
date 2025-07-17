import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Crosshair, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

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

  // Simple test function to check basic geolocation
  const testBasicGeolocation = () => {
    console.log('Testing basic geolocation...');
    console.log('Geolocation API available:', !!navigator.geolocation);
    console.log('getCurrentPosition function:', typeof navigator.geolocation?.getCurrentPosition);

    if (!navigator.geolocation) {
      console.error('Geolocation not available');
      return;
    }

    // Test with minimal options
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Basic geolocation test SUCCESS:', position);
        toast.success('Basic geolocation test passed!');
      },
      (error) => {
        console.log('Basic geolocation test FAILED:', error);
        console.log('Error details:', {
          code: error.code,
          message: error.message,
          PERMISSION_DENIED: error.PERMISSION_DENIED,
          POSITION_UNAVAILABLE: error.POSITION_UNAVAILABLE,
          TIMEOUT: error.TIMEOUT
        });
        toast.error(`Basic test failed: ${error.message}`);
      },
      { timeout: 5000, enableHighAccuracy: false, maximumAge: 0 }
    );
  };

  // Get current location with enhanced error handling and user feedback
  const getCurrentLocation = async () => {
    console.log('getCurrentLocation called');

    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      toast.error('Geolocation is not supported by this browser. Please click on the map to select a location.');
      return;
    }

    console.log('Starting geolocation request...');
    console.log('Current protocol:', window.location.protocol);
    console.log('Is secure context:', window.isSecureContext);

    // Check if geolocation API has been modified
    console.log('Geolocation API checks:');
    console.log('- navigator.geolocation:', navigator.geolocation);
    console.log('- getCurrentPosition type:', typeof navigator.geolocation.getCurrentPosition);
    console.log('- getCurrentPosition toString:', navigator.geolocation.getCurrentPosition.toString());
    console.log('- watchPosition type:', typeof navigator.geolocation.watchPosition);

    // Check for common extension interference
    const originalGetCurrentPosition = navigator.geolocation.getCurrentPosition;
    console.log('- Original function check:', originalGetCurrentPosition.toString().includes('[native code]'));

    // Run basic test first
    testBasicGeolocation();

    setIsGettingLocation(true);

    try {
      // Check permissions first if available
      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: 'geolocation' });
          console.log('Permission state:', permission.state);
          if (permission.state === 'denied') {
            toast.error('Location access is denied. Please enable location permissions in your browser settings and try again, or click on the map to select a location manually.');
            setIsGettingLocation(false);
            return;
          }
        } catch (permError) {
          console.warn('Permission query failed:', permError);
          // Continue with location request anyway
        }
      }

      // Try multiple approaches to bypass potential extension interference
      console.log('Trying simple getCurrentPosition...');

      // Approach 1: Direct call with conservative settings
      const simpleResult = await new Promise<GeolocationPosition | null>((resolve) => {
        const timeoutId = setTimeout(() => {
          console.log('Simple approach timed out');
          resolve(null);
        }, 8000);

        try {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              clearTimeout(timeoutId);
              console.log('Simple approach succeeded:', position);
              resolve(position);
            },
            (error) => {
              clearTimeout(timeoutId);
              console.log('Simple approach failed:', error);
              resolve(null);
            },
            { timeout: 7000, enableHighAccuracy: false, maximumAge: 300000 }
          );
        } catch (syncError) {
          clearTimeout(timeoutId);
          console.log('Simple approach threw synchronous error:', syncError);
          resolve(null);
        }
      });

      if (simpleResult) {
        const { latitude, longitude } = simpleResult.coords;
        console.log('Using simple result:', { latitude, longitude });

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
            console.warn('Reverse geocoding failed:', geocodeError);
            onLocationSelect(latitude, longitude, `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            toast.success('Location found successfully!');
          }
        }

        setIsGettingLocation(false);
        return;
      }

      // If simple approach failed, try alternative method
      console.log('Simple approach failed, trying alternative methods...');

      // Approach 2: Try with watchPosition as primary method
      const watchResult = await new Promise<GeolocationPosition | null>((resolve) => {
        let watchId: number | null = null;
        const timeoutId = setTimeout(() => {
          if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
          }
          console.log('Watch approach timed out');
          resolve(null);
        }, 10000);

        try {
          watchId = navigator.geolocation.watchPosition(
            (position) => {
              clearTimeout(timeoutId);
              if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
              }
              console.log('Watch approach succeeded:', position);
              resolve(position);
            },
            (error) => {
              clearTimeout(timeoutId);
              if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
              }
              console.log('Watch approach failed:', error);
              resolve(null);
            },
            { timeout: 8000, enableHighAccuracy: false, maximumAge: 300000 }
          );
        } catch (watchError) {
          clearTimeout(timeoutId);
          console.log('Watch approach threw synchronous error:', watchError);
          resolve(null);
        }
      });

      if (watchResult) {
        const { latitude, longitude } = watchResult.coords;
        console.log('Using watch result:', { latitude, longitude });

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
            console.warn('Reverse geocoding failed:', geocodeError);
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
              console.warn('getCurrentPosition failed, trying watchPosition as fallback:', error);
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
          console.log(`Attempting geolocation strategy ${i + 1}:`, strategies[i]);
          const position = await getLocationWithTimeout(strategies[i]);
          
          const { latitude, longitude, accuracy } = position.coords;
          console.log('Location obtained successfully:', { 
            latitude, 
            longitude, 
            accuracy: accuracy ? `${Math.round(accuracy)}m` : 'unknown',
            timestamp: new Date(position.timestamp).toISOString()
          });

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
              console.warn('Reverse geocoding failed:', geocodeError);
              // Still call onLocationSelect with coordinates
              onLocationSelect(latitude, longitude, `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
              toast.success('Location found successfully!');
            }
          }

          return; // Success, exit the function
        } catch (error) {
          lastError = error;
          console.warn(`Geolocation strategy ${i + 1} failed:`, error);
          
          // If this isn't the last strategy, continue to next one
          if (i < strategies.length - 1) {
            continue;
          }
        }
      }

      // All strategies failed, throw the last error
      throw lastError;

    } catch (error) {
      console.error('All geolocation attempts failed:', error);
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error?.constructor?.name);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        stack: error?.stack,
        toString: error?.toString?.()
      });

      let errorMessage = 'Unable to get your current location. ';

      if (error instanceof GeolocationPositionError) {
        console.log('GeolocationPositionError detected, code:', error.code);
        switch (error.code) {
          case GeolocationPositionError.PERMISSION_DENIED:
            errorMessage += 'Location access was denied. Please enable location permissions in your browser settings.';
            break;
          case GeolocationPositionError.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable. Please check that location services are enabled on your device.';
            break;
          case GeolocationPositionError.TIMEOUT:
            errorMessage += 'Location request timed out. Please ensure you have a stable internet connection.';
            break;
          default:
            errorMessage += `An unknown geolocation error occurred (code: ${error.code}).`;
            break;
        }
      } else if (error instanceof Error) {
        console.log('Standard Error detected:', error.message);
        if (error.message.includes('timeout')) {
          errorMessage += 'Location request timed out. Please try again or check your internet connection.';
        } else {
          errorMessage += `Error: ${error.message}`;
        }
      } else {
        console.log('Unknown error type:', error);
        errorMessage += `An unexpected error occurred while retrieving your location. Details: ${JSON.stringify(error)}`;
      }

      errorMessage += ' You can click anywhere on the map to manually select a location.';

      // Add note about potential browser extension interference
      if (errorMessage.includes('unexpected error')) {
        errorMessage += '\n\nNote: If you have browser extensions that modify location services, try disabling them or using incognito mode.';
      }

      // Show user-friendly error message
      toast.error(errorMessage, { duration: 10000 });
      
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
      {/* Enhanced Instructions */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <MapPin size={20} className="text-blue-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-800">How to select location:</p>
            <p className="text-sm text-blue-700 mt-1">
              <strong>Click anywhere on the map</strong> to drop a pin and select the disaster location. You can also try the location button (📍) to use your current position.
            </p>
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-800 font-medium">
                💡 <strong>Pro Tip:</strong> Use the zoom controls (+/-) to get a better view, then click precisely where the disaster occurred.
              </p>
            </div>
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800">
                <strong>Location Button Not Working?</strong> This is normal and can happen due to:
              </p>
              <ul className="text-xs text-amber-700 mt-1 ml-3 list-disc space-y-0.5">
                <li>Browser location permissions disabled</li>
                <li>Using HTTP instead of HTTPS</li>
                <li>Location services disabled on device</li>
                <li>Network connectivity issues</li>
              </ul>
              <p className="text-xs text-green-800 mt-2 font-medium">
                ✅ <strong>No Problem!</strong> Manual selection by clicking on the map works perfectly and is often more accurate!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Controls - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">Debug Controls:</p>
          <div className="flex space-x-2">
            <button
              onClick={testBasicGeolocation}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
            >
              Test Basic Geolocation
            </button>
            <button
              onClick={() => {
                console.log('Navigator geolocation:', navigator.geolocation);
                console.log('Permissions API:', 'permissions' in navigator);
                console.log('Secure context:', window.isSecureContext);
                console.log('Protocol:', window.location.protocol);
              }}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
            >
              Log Environment
            </button>
          </div>
        </div>
      )}

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
