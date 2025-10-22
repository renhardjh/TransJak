import axios from 'axios';
import { ApiResponse, VehicleResource, RouteResource, TripResource, VehicleData } from '../types';

const API_BASE_URL = 'https://api-v3.mbta.com';

const mbtaApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/vnd.api+json',
  },
});

export const fetchVehicles = async (
  offset: number,
  filters: { route?: string; trip?: string } = {}
): Promise<ApiResponse<VehicleResource>> => {
  const pageSize = 10;

  try {
    const params: { [key: string]: any } = {
      'page[limit]': pageSize,
      'page[offset]': offset,
      include: 'route,trip',
    };

    if (filters.route) {
      params['filter[route]'] = filters.route;
    }
    if (filters.trip) {
      params['filter[trip]'] = filters.trip; 
    }

    const response = await mbtaApi.get('/vehicles', { params });
    return response.data as ApiResponse<VehicleResource>;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw new Error('Gagal mengambil data kendaraan. Periksa koneksi atau filter Anda.');
  }
};

export const fetchRoutes = async (routeId?: string): Promise<ApiResponse<RouteResource>> => {
  const params: { [key: string]: any } = {};
  const pageSize = 10;
  const offset = 0;
  try {
    params['page[limit]'] = pageSize;
    params['page[offset]'] = offset;

    if (routeId) {
        params['filter[id]'] = routeId;
    }

    const response = await mbtaApi.get('/routes', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching routes:', error);
    throw new Error('Gagal mengambil data rute.');
  }
};

export const fetchTrips = async (routeId?: string, tripId?: string): Promise<ApiResponse<TripResource>> => {
  const params: { [key: string]: any } = {};
  const pageSize = 10;
  const offset = 0;

  params['page[limit]'] = pageSize;
  params['page[offset]'] = offset;

  if (tripId) {
    params['filter[id]'] = tripId;
  } else if (routeId) {
    params['filter[route]'] = routeId;
  }

  try {
    const response = await mbtaApi.get('/trips', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching trips:', error);
    throw new Error('Gagal mengambil data trip.');
  }
};

export const fetchVehicleDetail = async (id: string): Promise<VehicleResource> => {
    try {
        const response = await mbtaApi.get(`/vehicles/${id}`);
        return response.data.data as VehicleResource;
    } catch (error) {
        console.error(`Error fetching vehicle detail for ${id}:`, error);
        throw new Error('Gagal mengambil detail kendaraan.');
    }
};

export const mapVehicleResourceToData = (resource: VehicleResource): VehicleData => ({
    id: resource.id,
    label: resource.attributes.label ?? 'N/A',
    status: resource.attributes.current_status,
    latitude: resource.attributes.latitude,
    longitude: resource.attributes.longitude,
    lastUpdated: resource.attributes.updated_at,
    routeId: resource.relationships.route?.data?.id ?? 'Unknown',
    tripId: resource.relationships.trip?.data?.id ?? 'Unknown',
});