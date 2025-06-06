'use client';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

const mapContainerStyle = {
  width: '100%',
  height: '600px',
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
