import React, { useState, useEffect } from 'react';
import { 
    Modal, 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Button, 
    ScrollView, 
    ActivityIndicator 
} from 'react-native';
import { VehicleFilters, RouteResource, TripResource } from '../../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  currentFilters: VehicleFilters;
  onApply: (filters: VehicleFilters) => void;
  availableRoutes: RouteResource[];
  availableTrips: TripResource[];
  isLoading: boolean;
  error: string | null;
}

export const FilterModal: React.FC<Props> = ({
  visible,
  onClose,
  currentFilters,
  onApply,
  availableRoutes,
  availableTrips,
  isLoading,
  error,
}) => {
  const [selectedRouteIds, setSelectedRouteIds] = useState<string[]>(currentFilters.routeIds);
  const [selectedTripIds, setSelectedTripIds] = useState<string[]>(currentFilters.tripIds);
  
  useEffect(() => {
    if (visible) {
      setSelectedRouteIds(currentFilters.routeIds);
      setSelectedTripIds(currentFilters.tripIds);
    }
  }, [visible, currentFilters]);

  const toggleSelection = (id: string, type: 'route' | 'trip') => {
    if (type === 'route') {
      setSelectedRouteIds(prev =>
        prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
      );
    } else {
      setSelectedTripIds(prev =>
        prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
      );
    }
  };

  const handleApply = () => {
    onApply({
      routeIds: selectedRouteIds,
      tripIds: selectedTripIds,
    });
  };

  const handleReset = () => {
    setSelectedRouteIds([]);
    setSelectedTripIds([]);
    onApply({ routeIds: [], tripIds: [] });
  };
  
  const renderFilterOptions = (data: { id: string, name: string }[], selectedIds: string[], type: 'route' | 'trip') => (
      <View style={styles.optionsContainer}>
          {data.map(item => {
              const isSelected = selectedIds.includes(item.id);
              return (
                  <TouchableOpacity
                      key={item.id}
                      style={[styles.chip, isSelected ? styles.chipSelected : styles.chipDefault]}
                      onPress={() => toggleSelection(item.id, type)}
                  >
                      <Text style={isSelected ? styles.chipTextSelected : styles.chipTextDefault}>
                          {item.name} ({item.id})
                      </Text>
                  </TouchableOpacity>
              );
          })}
      </View>
  );

  if (isLoading) {
      return (
          <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
              <View style={styles.centeredView}>
                  <ActivityIndicator size="large" color="#0000ff" />
                  <Text style={styles.loadingText}>Memuat pilihan filter...</Text>
              </View>
          </Modal>
      );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Filter Kendaraan</Text>

        {error && (
            <View style={styles.errorBox}>
                <Text style={styles.errorText}>❌ {error}</Text>
                <Text style={{fontSize: 12, color: 'red'}}>Filter mungkin tidak lengkap.</Text>
            </View>
        )}

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Filter Rute */}
          <Text style={styles.filterHeader}>Filter Berdasarkan Rute ({selectedRouteIds.length} dipilih)</Text>
          {renderFilterOptions(
            availableRoutes.map(r => ({ id: r.id, name: r.attributes.long_name })),
            selectedRouteIds,
            'route'
          )}

          {/* Filter Trip */}
          <Text style={styles.filterHeader}>Filter Berdasarkan Trip ({selectedTripIds.length} dipilih)</Text>
          {renderFilterOptions(
            availableTrips.map(t => ({ id: t.id, name: t.attributes.headsign })),
            selectedTripIds,
            'trip'
          )}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button title="Tutup" onPress={onClose} color="#666" />
          <Button title="Reset Filter" onPress={handleReset} color="#f44336" />
          <Button title="Terapkan Filter" onPress={handleApply} disabled={isLoading} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  filterHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
  },
  chipDefault: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
  },
  chipSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  chipTextDefault: {
    color: '#333',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorBox: {
      padding: 10,
      backgroundColor: '#fdd',
      borderWidth: 1,
      borderColor: 'red',
      marginBottom: 10,
      borderRadius: 5,
  },
  errorText: {
      color: 'red',
      textAlign: 'center',
      fontWeight: 'bold',
  },
});