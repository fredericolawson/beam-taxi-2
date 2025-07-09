export type Trip = {
  id: string;
  rider_id: string;
  rider: Rider;
  driver_id: string | null;
  pickup_address: string;
  pickup_lat: number;
  pickup_lng: number;
  destination_address: string;
  destination_lat: number;
  destination_lng: number;
  offer_amount: number;
  requested_at: Date;
  assigned_at: Date | null;
};

export type TripInsert = {
  rider_id: string;
  pickup_lat: number;
  pickup_lng: number;
  destination_lat: number;
  destination_lng: number;
  offer_amount: number;
  pickup_time: Date | null;
  type: 'now' | 'later';
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
  phone: string | null;
  telegram_id: string;
  current_lat: number | null;
  current_lng: number | null;
  location_updated_at: Date | null;
  created_at: Date | null;
};
