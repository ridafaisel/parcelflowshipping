export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
}

export interface Center {
  id: number;
  name: string;
  city?: string;
  type?: string;
}

export interface Package {
  id: number;
  weight: number;
  dimensions: string;
  status: string;
  createdAt: string;
  sender: Customer;
  receiver: Customer;
  currentLocation: Location;
  tracks: any[];
}
