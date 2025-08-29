import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapPin, Navigation } from "lucide-react";

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface ContactMapProps {
  height?: string;
  className?: string;
}

const ContactMap: React.FC<ContactMapProps> = ({
  height = "300px",
  className = "",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // DisasterWatch Headquarters coordinates (using a real location for demo)
  const headquarters = {
    lat: 38.9072, // Washington, DC area
    lng: -77.0369,
    name: "DisasterWatch Headquarters",
    address: "123 Emergency Response Ave, Disaster City, DC 12345",
    phone: "+1 (555) 123-4567",
    email: "contact@disasterwatch.org",
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = () => {
      try {
        setMapError(null);

        // Clean up existing map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        // Check if mapRef.current is available
        if (!mapRef.current) {
          throw new Error("Map container not available");
        }

        const map = L.map(mapRef.current, {
          center: [headquarters.lat, headquarters.lng],
          zoom: 15,
          zoomControl: true,
          attributionControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          touchZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          zoomAnimation: false, // Disable zoom animation to prevent _leaflet_pos errors
          markerZoomAnimation: false, // Disable marker zoom animation to prevent _leaflet_pos errors
        });

        mapInstanceRef.current = map;

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
          minZoom: 1,
        }).addTo(map);

        // Create custom marker icon
        const customIcon = L.divIcon({
          html: `
            <div class="relative">
              <div class="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div class="absolute top-8 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-blue-600"></div>
            </div>
          `,
          className: "custom-marker",
          iconSize: [32, 48],
          iconAnchor: [16, 48],
          popupAnchor: [0, -48],
        });

        // Add marker for headquarters
        const marker = L.marker([headquarters.lat, headquarters.lng], {
          icon: customIcon,
        }).addTo(map);

        // Create popup content
        const popupContent = `
          <div class="p-2 max-w-xs">
            <div class="flex items-center mb-3">
              <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path d="M9 12l2 2 4-4"></path>
                  <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-sm">${headquarters.name}</h3>
                <p class="text-xs text-blue-600">Emergency Response Center</p>
              </div>
            </div>
            <div class="space-y-2 text-xs">
              <div class="flex items-start">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500 mt-0.5 mr-2 flex-shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span class="text-gray-700">${headquarters.address}</span>
              </div>
              <div class="flex items-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500 mr-2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <a href="tel:${headquarters.phone}" class="text-blue-600 hover:text-blue-800">${headquarters.phone}</a>
              </div>
              <div class="flex items-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500 mr-2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <a href="mailto:${headquarters.email}" class="text-blue-600 hover:text-blue-800">${headquarters.email}</a>
              </div>
            </div>
            <div class="mt-3 pt-2 border-t border-gray-200">
              <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${headquarters.lat},${headquarters.lng}', '_blank')" 
                      class="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
                Get Directions
              </button>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          className: "custom-contact-popup",
          maxWidth: 280,
          closeButton: true,
        });

        // Add tooltip
        marker.bindTooltip(
          `
          <div class="text-center">
            <div class="font-semibold text-sm">${headquarters.name}</div>
            <div class="text-xs text-gray-600">Click for details</div>
          </div>
        `,
          {
            permanent: false,
            direction: "top",
            offset: [0, -10],
            className: "custom-contact-tooltip",
          }
        );

        // Open popup by default
        marker.openPopup();

        setIsMapReady(true);

        // Force resize after initialization
        setTimeout(() => {
          if (map && mapRef.current) {
            map.invalidateSize();
          }
        }, 100);
      } catch (error) {
        setMapError("Failed to load map. Please try refreshing the page.");
        setIsMapReady(false);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initializeMap, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${headquarters.lat},${headquarters.lng}`;
    window.open(url, "_blank");
  };

  if (mapError) {
    return (
      <div className={`relative ${className}`} style={{ height }}>
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200">
          <div className="text-center p-4">
            <MapPin size={24} className="text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-3">{mapError}</p>
            <button onClick={openInGoogleMaps} className="btn-primary text-sm">
              <Navigation size={14} className="mr-1" />
              Open in Google Maps
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div
        ref={mapRef}
        style={{
          height: "100%",
          width: "100%",
        }}
        className="rounded-lg overflow-hidden shadow-lg"
      />

      {!isMapReady && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading interactive map...</p>
          </div>
        </div>
      )}

      {/* Get Directions Button */}
      <button
        onClick={openInGoogleMaps}
        className="absolute bottom-4 right-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg shadow-md text-sm font-medium transition-all duration-200 flex items-center z-10"
      >
        <Navigation size={14} className="mr-1" />
        Directions
      </button>
    </div>
  );
};

export default ContactMap;
