'use client';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Loader2 } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};
const miniMapContainerStyle = {
  width: '100%',
  height: '100%',
};

export function LocationDisplay({ latitude, longitude }: { latitude: number; longitude: number }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const center = {
    lat: latitude,
    lng: longitude,
  };

  if (!isLoaded) return <div className="h-[400px] w-full animate-pulse rounded-md bg-gray-200" />;

  return (
    <div className="flex w-full flex-grow rounded-md border">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        options={{
          mapTypeId: 'satellite',
          disableDefaultUI: false,
          zoomControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControlOptions: {
            style: null,
            position: null,
            mapTypeIds: ['satellite'],
          },
        }}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
}

export function MiniMap({ longitude, latitude }: { longitude: number; latitude: number }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  if (!isLoaded) return <Loader2 className="h-4 w-4 animate-spin" />;
  return (
    <div className="h-full w-full overflow-hidden rounded-r-md">
      <GoogleMap
        mapContainerStyle={miniMapContainerStyle}
        center={{ lat: latitude, lng: longitude }}
        zoom={12}
        options={{
          disableDefaultUI: true,
          zoomControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          clickableIcons: false,
          gestureHandling: 'none',
          keyboardShortcuts: false,
          scrollwheel: false,
          mapTypeControl: false,
          draggable: false,
        }}
      >
        <Marker position={{ lat: latitude, lng: longitude }} />
      </GoogleMap>
    </div>
  );
}
