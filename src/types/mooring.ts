// Types generated from Supabase schema for moorings

export type CommitmentTerm = 'monthly' | 'quarterly' | 'annual';

export type Mooring = {
  id: string;
  created_at: string;
  name: string;
  location_description: string | null;
  latitude: number | null;
  longitude: number | null;
  price_per_month: number | null;
  commitment_term: CommitmentTerm | null;
  is_available: boolean;
  owner_id: string;
  description: string | null;
};

export type CompleteMooring = Omit<Mooring, 'latitude' | 'longitude' | 'price_per_month' | 'commitment_term' | 'description'> & {
  latitude: number;
  longitude: number;
  price_per_month: number;
  commitment_term: CommitmentTerm;
  description: string;
  is_available: true; // Published moorings should be available
};

// Utility types for working with moorings
export type MooringLocation = {
  latitude: number;
  longitude: number;
  location_description?: string;
};

export type MooringWithLocation = Mooring & {
  latitude: number;
  longitude: number;
};

export type MooringSearchFilters = {
  minPrice?: number;
  maxPrice?: number;
  commitmentTerm?: CommitmentTerm;
  isAvailable?: boolean;
  location?: {
    latitude: number;
    longitude: number;
    radiusKm?: number;
  };
};

// Type guard to check if a mooring is ready for publication
export function isCompleteMooring(mooring: Mooring): mooring is CompleteMooring {
  return (
    mooring.latitude !== null &&
    mooring.longitude !== null &&
    mooring.price_per_month !== null &&
    mooring.commitment_term !== null &&
    mooring.description !== null &&
    mooring.description.trim().length > 0 &&
    mooring.is_available === true
  );
}

export function completeMoorings(moorings: Mooring[]): CompleteMooring[] {
  return moorings.filter(isCompleteMooring) as CompleteMooring[];
}
