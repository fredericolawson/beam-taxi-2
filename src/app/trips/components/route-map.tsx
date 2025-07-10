'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { APIProvider, Map, Marker, useMap, useMapsLibrary, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';

// Type definitions
interface LatLng {
  lat: number;
  lng: number;
}

interface Route {
  polyline: google.maps.Polyline;
  distance: string;
  distanceValue: number;
  duration: string;
  durationValue: number;
  bounds: google.maps.LatLngBounds;
}

interface RouteMapProps {
  pickup: LatLng | null;
  destination: LatLng | null;
  apiKey: string;
  className?: string;
  onRouteCalculated?: (metrics: { distance: number; duration: number }) => void;
}

// Component for handling route calculation and rendering
function RouteRenderer({
  pickup,
  destination,
  onRouteCalculated,
  setZoom,
}: {
  pickup: LatLng | null;
  destination: LatLng | null;
  onRouteCalculated?: (metrics: { distance: number; duration: number }) => void;
  setZoom: (zoom: number) => void;
}) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
  const [route, setRoute] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize services
  useEffect(() => {
    if (!routesLibrary || !map) return;

    const service = new routesLibrary.DirectionsService();
    const renderer = new routesLibrary.DirectionsRenderer({
      map,
      suppressMarkers: true, // We'll use custom markers
      polylineOptions: {
        strokeColor: '#4285F4',
        strokeWeight: 4,
        strokeOpacity: 0.8,
      },
    });

    setDirectionsService(service);
    setDirectionsRenderer(renderer);

    return () => {
      renderer.setMap(null);
    };
  }, [routesLibrary, map]);

  // Calculate route when pickup/destination changes
  useEffect(() => {
    if (!directionsService || !directionsRenderer || !pickup || !destination) {
      if (directionsRenderer) {
        directionsRenderer.setDirections({ routes: [] } as unknown as google.maps.DirectionsResult);
      }
      setRoute(null);
      return;
    }
    if (!pickup || !destination) return;

    const calculateRoute = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const request: google.maps.DirectionsRequest = {
          origin: pickup,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        };

        const result = await directionsService.route(request);

        if (result.routes[0]) {
          directionsRenderer.setDirections(result);
          const route = result.routes[0];
          const leg = route.legs[0];
          const distance = leg.distance?.value || 0; // Value in meters
          const duration = leg.duration?.value ? Math.round(leg.duration.value / 60) : 0; // Convert seconds to minutes
          const zoom = distance > 10000 ? 12 : distance > 5000 ? 13 : distance > 2000 ? 14 : 15;
          setZoom(zoom);

          const routeData: Route = {
            polyline: directionsRenderer.getDirections()?.routes[0]?.overview_polyline as unknown as google.maps.Polyline,
            distance: leg.distance?.text || 'Unknown',
            distanceValue: distance,
            duration: leg.duration?.text || 'Unknown',
            durationValue: duration,
            bounds: route.bounds,
          };

          setRoute(routeData);

          // Fit map to route bounds
          if (map && route.bounds) map.fitBounds(route.bounds);

          // Notify parent about route metrics
          onRouteCalculated?.({
            distance: distance, // Pass raw meters
            duration: duration, // Pass minutes
          });
        }
      } catch (error) {
        console.error('Route calculation error:', error);
        setError('Failed to calculate route. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    calculateRoute();
  }, [directionsService, directionsRenderer, pickup, destination, map, onRouteCalculated]);

  if (error) {
    return (
      <div className="absolute top-4 left-4 z-10 rounded-lg border border-red-200 bg-red-50 p-3">
        <div className="flex items-center text-sm font-medium text-red-600">
          <span className="mr-2">⚠️</span>
          {error}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="absolute top-4 left-4 z-10 rounded-lg border border-blue-200 bg-blue-50 p-3">
        <div className="flex items-center text-sm font-medium text-blue-600">
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          Calculating route...
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Route Info */}
      {route && (
        <div className="absolute top-4 left-4 z-10 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <div className="text-sm font-medium text-gray-800">
            <div>Distance: {route.distance}</div>
            <div>Duration: {route.duration}</div>
          </div>
        </div>
      )}

      {/* Pickup Marker */}
      {pickup && (
        <AdvancedMarker position={pickup}>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">A</div>
        </AdvancedMarker>
      )}

      {/* Destination Marker */}
      {destination && (
        <AdvancedMarker position={destination}>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">B</div>
        </AdvancedMarker>
      )}
    </>
  );
}

// Main component
export default function RouteMap({ pickup, destination, apiKey, className = 'w-full h-96', onRouteCalculated }: RouteMapProps) {
  const [mapCenter, setMapCenter] = useState<LatLng>(pickup || destination || { lat: 32.29482077750405, lng: -64.76918653081073 });
  const [zoom, setZoom] = useState(12);

  // Update center when pickup/destination changes
  useEffect(() => {
    if (pickup && destination) {
      // Center between pickup and destination
      const center = {
        lat: (pickup.lat + destination.lat) / 2,
        lng: (pickup.lng + destination.lng) / 2,
      };
      setMapCenter(center);
    } else if (pickup) {
      setMapCenter(pickup);
    } else if (destination) {
      setMapCenter(destination);
    }
  }, [pickup, destination]);

  return (
    <div className={`relative ${className} rounded-lg`}>
      <APIProvider apiKey={apiKey}>
        <Map
          mapId="route-map"
          defaultCenter={mapCenter}
          zoom={zoom}
          style={{ width: '100%', height: '100%' }}
          mapTypeId="roadmap"
          disableDefaultUI={false}
          zoomControl={true}
          mapTypeControl={false}
          scaleControl={true}
          streetViewControl={false}
          rotateControl={false}
          fullscreenControl={true}
          gestureHandling={'greedy'}
        >
          <RouteRenderer pickup={pickup} destination={destination} onRouteCalculated={onRouteCalculated} setZoom={setZoom} />
        </Map>
      </APIProvider>
    </div>
  );
}
