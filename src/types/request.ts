export type RawRequest = {
  id: string;
  created_at: string;
  description: string;
  owner_id: string;
  start_date: string | null;
  expires_on: string | null;
  request_type: 'walk-on' | 'swing' | 'either' | null;
  hurricane_insured: 'yes' | 'no' | 'either' | null;
  boat_length: string | null;
  preferred_location: string | null;
  price_from: number | null;
  price_to: number | null;
};

export type Request = {
  id: string;
  created_at: string;
  description: string;
  preferred_location: string;
  owner_id: string;
  start_date: Date;
  expires_on: Date;
  request_type: 'walk-on' | 'swing' | 'either';
  hurricane_insured: 'yes' | 'no' | 'either';
  boat_length: string;
  price_from: number;
  price_to: number;
  isComplete: boolean;
};
