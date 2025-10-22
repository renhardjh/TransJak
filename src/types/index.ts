export interface VehicleResource {
  id: string;
  attributes: {
    label: string | null;
    current_status: string;
    latitude: number | null;
    longitude: number | null;
    updated_at: string;
  };
  relationships: {
    route: { data: { id: string } };
    trip: { data: { id: string } };
  };
}

export interface RouteResource {
  id: string;
  attributes: {
    long_name: string;
  };
}

export interface TripResource {
  id: string;
  attributes: {
    headsign: string;
  };
}

export interface ApiResponse<T> {
  data: T[];
  links: {
    next: string | null;
    prev: string | null;
  };
}

export interface VehicleData {
  id: string;
  label: string;
  status: string;
  latitude: number | null;
  longitude: number | null;
  lastUpdated: string;
  routeId: string;
  tripId: string;
}

export interface VehicleFilters {
  routeIds: string[];
  tripIds: string[];
}