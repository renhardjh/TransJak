import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert, TextStyle } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { VehicleData } from '../types';
import MapView, { Marker } from 'react-native-maps';
import { fetchVehicleDetail, mapVehicleResourceToData, fetchRoutes, fetchTrips } from '../api/mbtaApi';

type RootStackParamList = {
  VehicleList: undefined;
  VehicleDetail: { vehicleId: string };
};
type VehicleDetailScreenProps = StackScreenProps<RootStackParamList, 'VehicleDetail'>;

export const VehicleDetailScreen: React.FC<VehicleDetailScreenProps> = ({ route }) => {
  const { vehicleId } = route.params;
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [routeName, setRouteName] = useState('Memuat...');
  const [tripHeadsign, setTripHeadsign] = useState('Memuat...');

  useEffect(() => {
    const loadVehicleDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const resource = await fetchVehicleDetail(vehicleId);
        const data = mapVehicleResourceToData(resource);
        setVehicleData(data);

        const [routesRes, tripsRes] = await Promise.all([
          fetchRoutes(data.routeId),
          fetchTrips(undefined, data.tripId),  
        ]);

        const route = routesRes.data.find(r => r.id === data.routeId);
        setRouteName(route ? route.attributes.long_name : 'ID Rute Tidak Ditemukan');
        
        const trip = tripsRes.data.find(t => t.id === data.tripId);
        setTripHeadsign(trip ? trip.attributes.headsign : 'ID Trip Tidak Ditemukan');
      } catch (err: any) {
        setError(err.message || 'Gagal memuat detail kendaraan.');
      } finally {
        setLoading(false);
      }
    };
    loadVehicleDetail();
  }, [vehicleId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Memuat detail kendaraan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>❌ {error}</Text>
      </View>
    );
  }

  if (!vehicleData) {
    return (
        <View style={styles.centered}>
            <Text style={styles.errorText}>Data kendaraan tidak ditemukan.</Text>
        </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Detail Kendaraan: {vehicleData.label}</Text>

      <View style={styles.detailCard}>
        <Text style={styles.label}>Label Kendaraan:</Text>
        <Text style={styles.value}>{vehicleData.label}</Text>
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.label}>Status Saat Ini:</Text>
        <Text style={valueStatus(vehicleData.status)}>{vehicleData.status}</Text>
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.label}>Rute (ID: {vehicleData.routeId}):</Text>
        <Text style={styles.value}>{routeName}</Text>
      </View>
      
      <View style={styles.detailCard}>
        <Text style={styles.label}>Trip (ID: {vehicleData.tripId}):</Text>
        <Text style={styles.value}>{tripHeadsign}</Text>
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.label}>Posisi (Lat, Lon):</Text>
        <Text style={styles.value}>
          {vehicleData.latitude?.toFixed(5) ?? 'N/A'}, {vehicleData.longitude?.toFixed(5) ?? 'N/A'}
        </Text>
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.label}>Waktu Update Terakhir:</Text>
        <Text style={styles.value}>{new Date(vehicleData.lastUpdated).toLocaleString()}</Text>
      </View>
      
      {vehicleData.latitude != null && vehicleData.longitude != null && (
        <View style={styles.mapContainer}>
          <Text style={styles.mapHeader}>Maps</Text>
              <View style={styles.mapPlaceholder}>
              <MapView
                initialRegion={{
                  latitude: Number(vehicleData.latitude),
                  longitude: Number(vehicleData.longitude),
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                style={styles.map}
              >
                <Marker
                  coordinate={{
                    latitude: Number(vehicleData.latitude),
                    longitude: Number(vehicleData.longitude),
                  }}
                  title={vehicleData.label}
                  description={vehicleData.status}
                />
              </MapView>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const valueStatus = (status: string): TextStyle => ({
  fontSize: 18,
  fontWeight: '500' as TextStyle['fontWeight'],
  marginTop: 2,
  color: status === 'IN_TRANSIT_TO' ? 'green' : (status === 'STOPPED_AT' ? 'orange' : '#000'),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
      marginTop: 10,
      fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  detailCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#007bff',
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 2,
    color: '#000',
  },
  mapContainer: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  mapHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  mapPlaceholder: {
      height: 200,
      backgroundColor: '#eee',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
  },
  map: {
    height: 200,
    width: '100%',
    borderRadius: 5,
  },
});