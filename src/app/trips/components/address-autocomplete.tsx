'use client';

import { useState, useEffect } from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function AddressAutocomplete({
  onSelect,
  placeholder = 'Enter address...',
}: {
  onSelect: (suggestion: any) => void;
  placeholder?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Maps is loaded
    if (typeof window !== 'undefined' && window.google) {
      setIsLoaded(true);
    }
  }, []);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      locationRestriction: {
        east: -64.63799944997153,
        west: -64.92021075368247,
        north: 32.40528183971958,
        south: 32.22016189582119,
      },
    },
    debounce: 300,
  });

  const handleSelect = async (description: string) => {
    setValue(description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);

      onSelect({
        address: description,
        lat,
        lng,
      });
    } catch (error) {
      console.error('Error getting geocode:', error);
    }
  };

  if (!isLoaded || !ready) {
    return <Input placeholder="Loading..." disabled />;
  }

  return (
    <div className="relative">
      <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} />
      {status === 'OK' && (
        <div className="bg-background absolute z-50 mt-1 w-full rounded-md border shadow-lg">
          {data.map((suggestion) => (
            <Button
              key={suggestion.place_id}
              variant="ghost"
              className="h-auto w-full justify-start p-3 text-left"
              onClick={() => handleSelect(suggestion.description)}
            >
              <div className="flex flex-col">
                <span className="font-medium">{suggestion.structured_formatting.main_text}</span>
                <span className="text-muted-foreground text-sm">{suggestion.structured_formatting.secondary_text}</span>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
