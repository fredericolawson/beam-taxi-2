export type RawRequest = {
  id: string;
  created_at: string;
  description: string;
  owner_id: string;
  start_date: string;
  expires_on: string;
  request_type: 'walk-on' | 'swing' | 'either';
  boat_length: string;
  price_from: number;
  price_to: number;
};

export type Request = {
  id: string;
  created_at: string;
  description: string;
  owner_id: string;
  start_date: Date;
  expires_on: Date;
  request_type: 'walk-on' | 'swing' | 'either';
  boat_length: string;
  price_from: number;
  price_to: number;
};
