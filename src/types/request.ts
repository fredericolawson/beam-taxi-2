export type Request = {
  id: string;
  created_at: string;
  name: string;
  description: string;
  owner_id: string;
  start_from: Date;
  start_to: Date;
  request_type: 'walk-on' | 'swing' | 'either';
};
