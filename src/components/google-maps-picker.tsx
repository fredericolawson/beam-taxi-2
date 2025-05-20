'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

// Type declarations for Google Maps API
declare global {
  interface Window {
    google: typeof google;
  }
}

interface GoogleMapsPickerProps {
  onLocationSelect: (locationData: {
    place_id: string;
    name: string;
    formatted_address: string;
    latitude: number;
    longitude: number;
  }) => void;
  defaultValue?: string;
  mapLocation?: {
    formatted_address: string;
    latitude: number;
    longitude: number;
    name: string;
  };
}

export function GoogleMapsPicker({ onLocationSelect, defaultValue, mapLocation }: GoogleMapsPickerProps) {
  const [searchInput, setSearchInput] = useState('');
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      initMap();
    }
  }, []);

  const initMap = () => {
    if (mapRef.current && window.google) {
      // Initialize map
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: { lat: 32.3078, lng: -64.7505 }, // Bermuda coordinates
        zoom: 12,
        mapTypeControl: false,
      });
      setMap(mapInstance);

      // Initialize autocomplete
      if (inputRef.current) {
        const autocompleteInstance = new google.maps.places.Autocomplete(inputRef.current);
        autocompleteInstance.bindTo('bounds', mapInstance);
        setAutocomplete(autocompleteInstance);

        // Add listener for place selection
        autocompleteInstance.addListener('place_changed', () => {
          const place = autocompleteInstance.getPlace();
          if (!place.geometry || !place.geometry.location) return;

          // Set map view to selected place
          mapInstance.setCenter(place.geometry.location);
          mapInstance.setZoom(17);

          // Add or update marker
          if (marker) {
            marker.setPosition(place.geometry.location);
          } else {
            const newMarker = new google.maps.Marker({
              map: mapInstance,
              position: place.geometry.location,
              animation: google.maps.Animation.DROP,
            });
            setMarker(newMarker);
          }

          // Create Google Maps URL
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const googleMapsUrl = `https://www.google.com/maps/place/?q=place_id:${place.place_id}`;

          // Pass location data to parent component
          onLocationSelect({
            place_id: place.place_id || '',
            name: place.name || searchInput || 'Selected Location',
            formatted_address: place.formatted_address || '',
            latitude: lat,
            longitude: lng,
          });
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative flex gap-2">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for a location here"
          value={mapLocation ? mapLocation.name : searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1"
        />
      </div>

      <Card className="h-[300px] w-full overflow-hidden">
        <div ref={mapRef} className="h-full w-full" />
      </Card>
    </div>
  );
}
