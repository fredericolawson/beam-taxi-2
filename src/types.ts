export type Trip = {
  id: string;
  rider_id: string;
  rider: Rider;
  driver_id: string | null;
  driver: Driver | null;
  pickup_address: string;
  pickup_lat: number;
  pickup_lng: number;
  destination_address: string;
  destination_lat: number;
  destination_lng: number;
  duration: number;
  offer_amount: number;
  distance: number;
  requested_at: Date;
  assigned_at: Date | null;
  cancelled_at: Date | null;
  status: 'pending' | 'assigned' | 'cancelled';
};

export type RawTrip = Omit<Trip, 'status'>;

export type AssignedTrip = Trip & {
  message_id: number;
  driver: Driver;
};

export type TripInsert = {
  rider_id: string;
  pickup_lat: number;
  pickup_lng: number;
  destination_lat: number;
  destination_lng: number;
  offer_amount: number;
  pickup_time: Date | null;
  duration: number;
  distance: number;
};

export type Rider = {
  id: string;
  name: string;
  phone: string;
  created_at: Date | null;
};

export type Driver = {
  id: string;
  name: string;
  phone: string;
  telegram_id: string;
  current_lat: number | null;
  current_lng: number | null;
  location_updated_at: Date | null;
  created_at: Date | null;
};
