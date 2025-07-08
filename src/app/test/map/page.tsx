'use client';

import { useState, useEffect } from 'react';
import { sendLocation } from '@/actions/telegram';
import { APIProvider, Map, Marker, MapMouseEvent } from '@vis.gl/react-google-maps';

interface Location {
  lat: number;
  lng: number;
}

export default function TestPage() {
  const [location, setLocation] = useState<Location | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleMapClick = (event: MapMouseEvent) => {
    if (event.detail?.latLng) {
      const lat = event.detail.latLng.lat;
      const lng = event.detail.latLng.lng;
      setLocation({ lat, lng });
    }
  };
  useEffect(() => {
    if (location) {
      setIsSending(true);
      sendLocation(location.lat, location.lng).then((result) => {
        setIsSending(false);
      });
    }
  }, [location]);
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        defaultCenter={{ lat: 32.29419722130781, lng: -64.77670184254964 }}
        defaultZoom={10}
        onClick={handleMapClick}
        className="h-96 w-full"
      >
        {location && <Marker position={location} />}
      </Map>
      <Coordinates location={location} />
    </APIProvider>
  );
}
function Coordinates({ location }: { location: Location | null }) {
  if (!location) return null;
  return (
    <div>
      <p>Latitude: {location.lat}</p>
      <p>Longitude: {location.lng}</p>
    </div>
  );
}
