'use client';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

import { Loader2 } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { updateMooring } from '@/actions/moorings';
import { Mooring } from '@/types/mooring';
import { toast } from 'sonner';

export interface MooringLocation {
  lat: number;
  lng: number;
}

const MAP_CONFIG = {
  containerStyle: { width: '100%', height: '500px' },
  defaultCenter: { lat: 32.281931, lng: -64.814753 },
  defaultZoom: 12,
} as const;

const useGoogleMaps = () => {
  return useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });
};

interface MooringCardProps {
  location: MooringLocation;
  onSave?: () => void;
}

const MooringCard: React.FC<MooringCardProps> = ({ location, onSave }) => (
  <Card>
    <CardHeader>
      <CardTitle>Mooring Coordinates</CardTitle>
    </CardHeader>

    <CardContent className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
      <div>
        <strong>Latitude:</strong> {location.lat.toFixed(6)}°
      </div>
      <div>
        <strong>Longitude:</strong> {location.lng.toFixed(6)}°
      </div>
    </CardContent>

    {onSave && (
      <CardFooter>
        <Button onClick={onSave}>Save</Button>
      </CardFooter>
    )}
  </Card>
);

interface MooringMapProps {
  onMooringSelect: (location: MooringLocation) => void;
  initialCenter?: google.maps.LatLngLiteral;
}

const MooringMap: React.FC<MooringMapProps> = ({ onMooringSelect, initialCenter = MAP_CONFIG.defaultCenter }) => {
  const [marker, setMarker] = useState<google.maps.LatLngLiteral | null>(null);
  const { isLoaded, loadError } = useGoogleMaps();

  const getMapOptions = (): google.maps.MapOptions => {
    if (!isLoaded || !window.google) {
      return {
        mapTypeId: 'hybrid',
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: true,
        fullscreenControl: true,
      };
    }

    return {
      mapTypeId: 'hybrid',
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: true,
      fullscreenControl: true,
      mapTypeControlOptions: {
        style: null,
        position: null,
        mapTypeIds: ['satellite'],
      },
    };
  };

  const handleLocationSelect = useCallback(
    async (latLng: google.maps.LatLngLiteral) => {
      setMarker(latLng);
      onMooringSelect({ ...latLng });
    },
    [onMooringSelect]
  );

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const latLng = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        handleLocationSelect(latLng);
      }
    },
    [handleLocationSelect]
  );

  const handleMarkerDragEnd = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const latLng = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        handleLocationSelect(latLng);
      }
    },
    [handleLocationSelect]
  );

  if (loadError) return <Loader2 className="animate-spin" />;
  if (!isLoaded) return <Loader2 className="animate-spin" />;

  return (
    <GoogleMap
      mapContainerStyle={MAP_CONFIG.containerStyle}
      center={initialCenter}
      zoom={MAP_CONFIG.defaultZoom}
      onClick={handleMapClick}
      options={getMapOptions()}
    >
      {marker && <Marker position={marker} draggable onDragEnd={handleMarkerDragEnd} title="Mooring Location" />}
    </GoogleMap>
  );
};

memo(MooringMap);

export function Master({ mooring }: { mooring: Mooring }) {
  const [location, setLocation] = useState<MooringLocation | null>(null);

  const handleSave = async () => {
    if (!location) return;
    const { updatedMooring, error } = await updateMooring({
      mooringId: mooring.id,
      data: { latitude: location.lat, longitude: location.lng },
    });
    if (error) {
      console.error(error);
    } else {
      toast.success('Mooring location saved!');
    }
  };

  return (
    <div className="max-w-4xl">
      <header className="mb-6 text-center">
        <h1 className="heading-2 mb-2">Select Location</h1>
        <p className="">Click on the map to place your mooring pin</p>
      </header>

      <div className="border-border rounded-lg border object-cover">
        <MooringMap onMooringSelect={setLocation} />
      </div>

      {location && (
        <section>
          <MooringCard location={location} onSave={handleSave} />
        </section>
      )}
    </div>
  );
}
