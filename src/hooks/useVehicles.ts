import { useState, useEffect, useCallback } from 'react';
import { fetchVehicles, mapVehicleResourceToData } from '../api/mbtaApi';
import { VehicleData, VehicleFilters } from '../types';

const PAGE_SIZE = 10;

export const useVehicles = (initialFilters: VehicleFilters) => {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<VehicleFilters>(initialFilters);

  const fetchVehicleData = useCallback(async (currentOffset: number, isRefresh: boolean = false) => {
    if ((!hasMore && !isRefresh) || loading) return;

    setLoading(true);
    setError(null);

    const routeFilter = filters.routeIds.join(',');
    const tripFilter = filters.tripIds.join(',');

    try {
      const response = await fetchVehicles(currentOffset, { 
        route: routeFilter, 
        trip: tripFilter 
      });
      
      const newVehicles = response.data.map(mapVehicleResourceToData);

      if (isRefresh || currentOffset === 0) {
        setVehicles(newVehicles);
      } else {
        setVehicles(prev => [...prev, ...newVehicles]);
      }

      setOffset(currentOffset + newVehicles.length);
      
      setHasMore(newVehicles.length === PAGE_SIZE && response.links.next !== null); 

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memuat data.');
      setHasMore(false); 
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, filters]);

  useEffect(() => {
    setOffset(0);
    setVehicles([]);
    setHasMore(true);
    fetchVehicleData(0, true); 
  }, [filters]);

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchVehicleData(offset);
    }
  };

  const pullRefresh = () => {
    setOffset(0);
    setVehicles([]);
    setHasMore(true);
    fetchVehicleData(0, true);
  };
  
  const applyFilters = (newFilters: VehicleFilters) => {
      setFilters(newFilters);
  }

  return { 
      vehicles, 
      loading, 
      error, 
      hasMore, 
      loadMore, 
      pullRefresh, 
      filters, 
      applyFilters 
  };
};