'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

declare global {
  interface Window {
    google: typeof google;
  }
}

interface LocationSelectorProps {
  onLocationSelect: (locationData: {
    place_id: string;
    name: string;
    formatted_address: string;
    latitude: number;
    longitude: number;
  }) => void;
  initialValues?: {
    name?: string;
    formatted_address?: string;
    latitude?: number;
    longitude?: number;
    place_id?: string;
  };
}

export function LocationSelector({ onLocationSelect, initialValues }: LocationSelectorProps) {
  return <GoogleMapsPicker onLocationSelect={onLocationSelect} initialValues={initialValues} />;
}

interface GoogleMapsPickerProps {
  onLocationSelect: (locationData: {
    place_id: string;
    name: string;
    formatted_address: string;
    latitude: number;
    longitude: number;
  }) => void;
  initialValues?: {
    name?: string;
    formatted_address?: string;
    latitude?: number;
    longitude?: number;
    place_id?: string;
  };
}

export function GoogleMapsPicker({ onLocationSelect, initialValues }: GoogleMapsPickerProps) {
  const [searchInput, setSearchInput] = useState(initialValues?.name || '');
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [currentCoordinates, setCurrentCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(initialValues?.latitude && initialValues?.longitude ? { lat: initialValues.latitude, lng: initialValues.longitude } : null);
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (initialValues?.name && initialValues.name !== searchInput) {
      setSearchInput(initialValues.name);
    }
  }, [initialValues?.name, searchInput]);

  const clearExistingMarker = useCallback(() => {
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
  }, []);

  const reverseGeocode = useCallback(
    (lat: number, lng: number) => {
      console.log('reverseGeocode called with:', lat, lng);
      console.log('onLocationSelect function:', onLocationSelect);

      if (!geocoder) {
        console.log('No geocoder available');
        return;
      }

      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        console.log('Geocoding result:', status, results);

        if (status === 'OK' && results?.[0]) {
          const result = results[0];
          const locationData = {
            place_id: result.place_id || '',
            name: result.address_components?.[0]?.long_name || 'Selected Location',
            formatted_address: result.formatted_address || '',
            latitude: lat,
            longitude: lng,
          };

          console.log('Calling onLocationSelect with:', locationData);
          onLocationSelect(locationData);
          setSearchInput(result.formatted_address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        } else {
          // Fallback if geocoding fails
          const locationData = {
            place_id: '',
            name: 'Selected Location',
            formatted_address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            latitude: lat,
            longitude: lng,
          };

          console.log('Geocoding failed, calling onLocationSelect with fallback:', locationData);
          onLocationSelect(locationData);
          setSearchInput(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
      });
    },
    [geocoder, onLocationSelect]
  );

  const createMarker = useCallback(
    (lat: number, lng: number, map: google.maps.Map) => {
      // Remove existing marker first
      clearExistingMarker();

      // Update coordinates state immediately
      setCurrentCoordinates({ lat, lng });

      // Create new marker
      const newMarker = new google.maps.Marker({
        map: map,
        position: { lat, lng },
        animation: google.maps.Animation.DROP,
        draggable: true,
      });

      // Add drag listener
      newMarker.addListener('dragend', () => {
        const position = newMarker.getPosition();
        if (position) {
          const dragLat = position.lat();
          const dragLng = position.lng();
          setCurrentCoordinates({ lat: dragLat, lng: dragLng });
          reverseGeocode(dragLat, dragLng);
        }
      });

      // Update the ref
      markerRef.current = newMarker;

      return newMarker;
    },
    [clearExistingMarker, reverseGeocode]
  );

  // Load Google Maps script
  useEffect(() => {
    const initMap = () => {
      if (mapRef.current && window.google) {
        const initialCenter =
          initialValues?.latitude && initialValues?.longitude
            ? { lat: initialValues.latitude, lng: initialValues.longitude }
            : { lat: 32.3078, lng: -64.7505 }; // Bermuda coordinates

        const initialZoom = initialValues?.latitude && initialValues?.longitude ? 17 : 12;

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: initialCenter,
          zoom: initialZoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
        });
        setMap(mapInstance);

        // Initialize geocoder
        const geocoderInstance = new google.maps.Geocoder();
        setGeocoder(geocoderInstance);

        // Set initial marker if location data exists
        if (initialValues?.latitude && initialValues?.longitude) {
          createMarker(initialValues.latitude, initialValues.longitude, mapInstance);
        }

        // Add click listener to map for dropping pins
        mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
          const lat = event.latLng?.lat();
          const lng = event.latLng?.lng();

          console.log('Map clicked at:', lat, lng);

          if (lat !== undefined && lng !== undefined) {
            // Create new marker (this will automatically remove the previous one)
            createMarker(lat, lng, mapInstance);

            // Reverse geocode the location
            console.log('About to call reverseGeocode');
            reverseGeocode(lat, lng);
          }
        });

        // Initialize autocomplete
        if (inputRef.current) {
          const autocompleteInstance = new google.maps.places.Autocomplete(inputRef.current);
          autocompleteInstance.bindTo('bounds', mapInstance);

          // Add listener for place selection
          autocompleteInstance.addListener('place_changed', () => {
            const place = autocompleteInstance.getPlace();
            if (!place.geometry || !place.geometry.location) return;

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            console.log('Place selected:', place.name, lat, lng);

            // Set map view to selected place
            mapInstance.setCenter({ lat, lng });
            mapInstance.setZoom(17);

            // Create new marker (this will automatically remove the previous one)
            createMarker(lat, lng, mapInstance);

            // Pass location data to parent component
            const locationData = {
              place_id: place.place_id || '',
              name: place.name || '',
              formatted_address: place.formatted_address || '',
              latitude: lat,
              longitude: lng,
            };

            console.log('Calling onLocationSelect from search with:', locationData);
            onLocationSelect(locationData);
            setSearchInput(place.name || '');
          });
        }
      }
    };

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
  }, [initialValues?.latitude, initialValues?.longitude, createMarker, reverseGeocode, onLocationSelect]);

  const handleMapTypeChange = (value: string) => {
    if (!map) return;

    const newMapType = value as 'roadmap' | 'satellite';
    const googleMapType = newMapType === 'roadmap' ? google.maps.MapTypeId.ROADMAP : google.maps.MapTypeId.SATELLITE;

    map.setMapTypeId(googleMapType);
    setMapType(newMapType);
  };

  return (
    <div className="space-y-4">
      <div className="relative flex gap-2">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for a location or click on the map"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1"
        />
      </div>

      <div className="relative">
        <div className="aspect-square w-full overflow-hidden rounded-md">
          <div ref={mapRef} className="h-full w-full" />
        </div>

        {/* Map Type Toggle Tabs */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <Tabs value={mapType} onValueChange={handleMapTypeChange}>
            <TabsList className="bg-white/90 shadow-md">
              <TabsTrigger value="roadmap" className="text-xs">
                🗺️ Map
              </TabsTrigger>
              <TabsTrigger value="satellite" className="text-xs">
                🛰️ Satellite
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {currentCoordinates && (
        <div className="flex flex-col gap-1">
          <div className="text-foreground text-sm font-medium">📍 Pin Location:</div>
          <div className="text-muted-foreground bg-muted rounded p-2 font-mono text-xs">
            Latitude: {currentCoordinates.lat.toFixed(6)}
            <br />
            Longitude: {currentCoordinates.lng.toFixed(6)}
          </div>
        </div>
      )}

      <p className="text-muted-foreground text-xs">
        💡 Tip: Search for a location above, click anywhere on the map, or drag the marker to select your mooring location.
      </p>
    </div>
  );
}
