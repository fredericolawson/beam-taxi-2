import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { GoogleMapsPicker } from './google-maps-picker';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

// Type declarations for Google Maps API
declare global {
  interface Window {
    google: typeof google;
  }
}

export function LocationModal({
  showLocationModal,
  setShowLocationModal,
}: {
  showLocationModal: boolean;
  setShowLocationModal: (show: boolean) => void;
}) {
  const router = useRouter();

  if (!showLocationModal) return null;

  return (
    <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
      <DialogContent
        className="max-w-2xl"
        onPointerDownOutside={(event: Event) => {
          const target = event.target as HTMLElement;
          if (target.closest('.pac-container')) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Create New Location</DialogTitle>
          <DialogDescription>
            Add a new location for your events. This location will be available for selection once created.
          </DialogDescription>
        </DialogHeader>
        <LocationForm
          location={null}
          host={host}
          onClose={() => {
            setShowLocationModal(false);
            router.refresh(); // Refresh to get updated locations
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

const locationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  place_id: z.string().optional(),
  formatted_address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  host_id: z.string(),
});

function LocationForm({ location, host, onClose }: { location: Location | null; host: Host; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: location?.name || '',
      place_id: location?.place_id || '',
      formatted_address: location?.formatted_address || '',
      latitude: location?.latitude || undefined, // Use undefined for optional numbers
      longitude: location?.longitude || undefined, // Use undefined for optional numbers
      host_id: host.id,
    },
  });

  const watchedFormValues = form.watch();

  const handleLocationSelect = (locationData: any) => {
    form.setValue('name', locationData.name);
    form.setValue('place_id', locationData.place_id);
    form.setValue('formatted_address', locationData.formatted_address);
    form.setValue('latitude', locationData.latitude);
    form.setValue('longitude', locationData.longitude);
    // host_id is already set in defaultValues and doesn't need to be updated here
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    setLoading(true);
    try {
      await createLocation(data);
      toast.success('Location created successfully');
      if (onClose) onClose();
    } catch (error) {
      console.error('Failed to create location:', error);
      toast.error('Failed to create location: ' + String(error));
    } finally {
      setLoading(false);
      router.refresh();
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormDescription>Edit this if you want to manually override the Google Maps name.</FormDescription>
              <FormControl>
                <Input placeholder="Location name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Location</FormLabel>
          <GoogleMapsPicker
            onLocationSelect={handleLocationSelect}
            initialValues={{
              name: watchedFormValues.name,
              formatted_address: watchedFormValues.formatted_address,
              latitude: watchedFormValues.latitude,
              longitude: watchedFormValues.longitude,
              place_id: watchedFormValues.place_id,
            }}
          />
        </FormItem>
        <div className="flex gap-2">
          <Button type="submit">Create Location</Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
        {watchedFormValues.formatted_address && (
          <div className="text-muted-foreground text-sm">
            <p>Selected: {watchedFormValues.formatted_address}</p>
          </div>
        )}
      </form>
    </Form>
  );
}
