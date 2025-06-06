'use client';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
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
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          fullscreenControl: false,
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
          mapTypeId: 'satellite',
        }}
      >
        <Marker position={{ lat: latitude, lng: longitude }} />
      </GoogleMap>
    </div>
  );
}

/*

function MapTypeToggle({ mapType, setMapType }: { mapType: "roadmap" | "satellite", setMapType: (mapType: "roadmap" | "satellite") => void }) {
  return(
    <Tabs value={mapType} onValueChange={(value) => setMapType(value as "roadmap" | "satellite")}>
        <TabsList className="bg-white/90 shadow-md">
          <TabsTrigger value="roadmap" className="text-xs">
            🗺️ Map
          </TabsTrigger>
          <TabsTrigger value="satellite" className="text-xs">
            🛰️ Satellite
          </TabsTrigger>
        </TabsList>
      </Tabs>
  )
}
  */
