export type Trip = {
  id: string;
  riderId: string;
  driverId: string;
  startLocation: string;
  endLocation: string;
  startDate: Date;
  endDate: Date;
  offer: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
};

export type Rider = {
  id: string;
  name: string;
  phone: string;
  email: string;
  isApproved: boolean;
};

export type Driver = {
  id: string;
  name: string;
  licensePlate: string;
  phone: string;
  email: string;
  isApproved: boolean;
};

export type TripRequest = {
  id: string;
  pickup: {
    address: string;
    lat: number;
    lng: number;
  };
  destination: {
    address: string;
    lat: number;
    lng: number;
  };
  fare: number;
  rider: {
    name: string;
    phone: string;
  };
};
