import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, RefreshControl, Button, Alert } from 'react-native';
import { useVehicles } from '../hooks/useVehicles';
import { VehicleCard } from '../components/vehicle/VehicleCard';
import { VehicleFilters, VehicleData, RouteResource, TripResource } from '../types';
import { FilterModal } from '../components/vehicle/FilterModal';
import { fetchRoutes, fetchTrips } from '../api/mbtaApi';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  VehicleList: undefined;
  VehicleDetail: { vehicleId: string };
};
type VehicleListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'VehicleList'>;

interface Props {
  navigation: VehicleListScreenNavigationProp;
}

const initialFilters: VehicleFilters = { routeIds: [], tripIds: [] };

export const VehicleListScreen: React.FC<Props> = ({ navigation }) => {
  const { 
      vehicles, 
      loading, 
      error, 
      hasMore, 
      loadMore, 
      pullRefresh, 
      filters, 
      applyFilters 
  } = useVehicles(initialFilters);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [availableRoutes, setAvailableRoutes] = useState<RouteResource[]>([]);
  const [availableTrips, setAvailableTrips] = useState<TripResource[]>([]);
  const [filterLoading, setFilterLoading] = useState(true);
  const [filterError, setFilterError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadFilterData = async () => {
        setFilterLoading(true);
        try {
            const routesRes = await fetchRoutes();
            setAvailableRoutes(routesRes.data);

            const tripPromises = routesRes.data.map(r => fetchTrips(r.id));
            const settled = await Promise.allSettled(tripPromises);

            const tripsMap = new Map<string, TripResource>();
            settled.forEach(result => {
              if (result.status === 'fulfilled') {
                setAvailableTrips(result.value.data);
              }
            });
            
            setFilterError(null);
        } catch (err: any) {
            setFilterError(err.message || 'Gagal memuat pilihan filter.');
        } finally {
            setFilterLoading(false);
        }
    };
    loadFilterData();
  }, []);
  
  const handleApplyFilter = (newFilters: VehicleFilters) => {
    applyFilters(newFilters);
    setIsModalVisible(false);
  };

  const renderFooter = () => {
    if (!loading || vehicles.length === 0) return null; 
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Memuat 10 data kendaraan berikutnya...</Text>
      </View>
    );
  };
  
  const renderEmptyList = () => {
      if (loading || filterLoading) return null; 
      
      if (error) {
          return (
              <View style={styles.emptyContainer}>
                  <Text style={styles.errorText}>❌ {error}</Text>
                  <Button title="Coba Lagi" onPress={pullRefresh} />
              </View>
          );
      }
      
      if (vehicles.length === 0 && !hasMore) {
           return (
              <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Tidak ada kendaraan yang ditemukan dengan filter ini.</Text>
                  <Button title="Reset Filter" onPress={() => handleApplyFilter(initialFilters)} />
              </View>
          );
      }
      return null;
  };
  
  const keyExtractor = (item: VehicleData) => item.id;
  
  const renderItem = ({ item }: { item: VehicleData }) => (
    <VehicleCard 
      vehicle={item} 
      onPress={() => navigation.navigate('VehicleDetail', { vehicleId: item.id })} 
    />
  );

  return (
    <View style={styles.container}>
      {/* Tombol Filter */}
      <Button 
          title={`Filter (${filters.routeIds.length} Rute, ${filters.tripIds.length} Trip)`} 
          onPress={() => setIsModalVisible(true)} 
      />
      
      {/* Tampilkan error global jika ada */}
      {error && vehicles.length === 0 && (
          <View style={styles.errorBox}>
              <Text style={styles.errorText}>❌ {error}</Text>
          </View>
      )}

      <FlatList
        data={vehicles}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={loading && vehicles.length === 0}
            onRefresh={pullRefresh}
          />
        }
      />
      
      {/* Modal Filter */}
      <FilterModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        currentFilters={filters}
        onApply={handleApplyFilter}
        availableRoutes={availableRoutes}
        availableTrips={availableTrips}
        isLoading={filterLoading}
        error={filterError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#ced0ce',
    alignItems: 'center',
  },
  loadingText: {
      marginTop: 5,
      fontSize: 14,
      color: '#666',
  },
  errorBox: {
      padding: 10,
      backgroundColor: '#fdd',
      borderWidth: 1,
      borderColor: 'red',
      marginVertical: 10,
      borderRadius: 5,
  },
  errorText: {
      color: 'red',
      textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  }
});