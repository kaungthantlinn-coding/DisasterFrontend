import React, { useState, useEffect } from "react";
import { DisasterEventService } from "../../services/disasterEventService";
import { useAuthStore } from "../../stores/authStore";
import { DisasterEventDto } from "../../types/DisasterEvent";

interface DisasterEventSelectorProps {
  value: string | null | undefined;
  onChange: (value: string | null | undefined) => void;
  error?: string;
}

const DisasterEventSelector: React.FC<DisasterEventSelectorProps> = ({
  value,
  onChange,
  error,
}) => {
  const [disasterEvents, setDisasterEvents] = useState<DisasterEventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState<DisasterEventDto[]>([]);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const fetchDisasterEvents = async () => {
      try {
        setLoading(true);
        const events = await DisasterEventService.getAll(accessToken);
        setDisasterEvents(events);
      } catch (err) {
        console.error("Failed to fetch disaster events:", err);
        setDisasterEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDisasterEvents();
  }, [accessToken]);

  useEffect(() => {
    // Filter events based on current input value
    if (value && typeof value === 'string') {
      const filtered = disasterEvents.filter(event => 
        event.name && typeof event.name === 'string' && 
        event.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(disasterEvents);
    }
  }, [value, disasterEvents]);

  const handleCreateEvent = async (eventName: string) => {
    if (!eventName.trim()) return;

    // Find the first disaster type to use as default
    const defaultDisasterTypeId = disasterEvents.length > 0 
      ? disasterEvents[0].disasterTypeId 
      : 1; // fallback to 1 if no events exist

    try {
      const newEvent = await DisasterEventService.create(
        {
          name: eventName.trim(),
          disasterTypeId: defaultDisasterTypeId,
        },
        accessToken
      );
      
      setDisasterEvents(prev => [...prev, newEvent]);
      onChange(newEvent.name);
      setShowSuggestions(false);
    } catch (err) {
      console.error("Failed to create disaster event:", err);
      // You might want to show an error message to the user here
    }
  };

  if (loading) {
    return (
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Disaster Event Name
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Loading events..."
            className="border p-2 rounded-lg w-full bg-gray-100"
            disabled
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Disaster Event Name
        {error && (
          <span className="text-red-500 text-sm">
            {" "}- {error}
          </span>
        )}
      </label>
      
      <div className="relative">
        <input
          type="text"
          placeholder="Start typing to see suggestions or enter a new event name"
          className="border p-2 rounded-lg w-full"
          value={value || ""}
          onChange={(e) => onChange(e.target.value || null)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            // Delay hiding suggestions to allow clicking on them
            setTimeout(() => setShowSuggestions(false), 200);
          }}
        />
        
        {showSuggestions && (filteredEvents.length > 0 || value) && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onMouseDown={() => {
                  onChange(event.name);
                  setShowSuggestions(false);
                }}
              >
                {event.name}
              </div>
            ))}
            
            {value && !filteredEvents.some(event => event.name === value) && (
              <div
                className="px-4 py-2 bg-green-50 hover:bg-green-100 cursor-pointer border-t border-gray-200"
                onMouseDown={() => handleCreateEvent(value)}
              >
                <span className="text-green-700">Create new event: </span>
                <strong>"{value}"</strong>
              </div>
            )}
          </div>
        )}
      </div>
      
      <p className="mt-2 text-sm text-gray-500">
        Select from existing events or type a new name to create one
      </p>
    </div>
  );
};

export default DisasterEventSelector;