import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { VehicleData } from '../../types';

interface Props {
  vehicle: VehicleData;
  onPress: () => void;
}

export const VehicleCard: React.FC<Props> = ({ vehicle, onPress }) => {
    const formatTime = (isoString: string) => {
        try {
            return new Date(isoString).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
        } catch {
            return 'N/A';
        }
    };
    
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'IN_TRANSIT_TO':
                return styles.statusInTransit;
            case 'STOPPED_AT':
                return styles.statusStopped;
            default:
                return styles.statusOther;
        }
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.header}>
                <Text style={styles.label}>{vehicle.label || 'Label Tidak Tersedia'}</Text>
                <Text style={[styles.status, getStatusStyle(vehicle.status)]}>
                    {vehicle.status}
                </Text>
            </View>
            <View style={styles.body}>
                <Text style={styles.text} numberOfLines={1}>
                    📍 Lat/Lon: {vehicle.latitude?.toFixed(4) ?? 'N/A'}, {vehicle.longitude?.toFixed(4) ?? 'N/A'}
                </Text>
                <Text style={styles.text}>
                    ⏱ Update: {formatTime(vehicle.lastUpdated)}
                </Text>
                <Text style={styles.text}>
                    🚌 Rute ID: {vehicle.routeId}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 5,
        marginBottom: 5,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    status: {
        fontSize: 14,
        fontWeight: '600',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 5,
        overflow: 'hidden',
    },
    statusInTransit: {
        backgroundColor: '#d4edda',
        color: '#155724',
    },
    statusStopped: {
        backgroundColor: '#fff3cd',
        color: '#856404',
    },
    statusOther: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
    },
    body: {
        marginTop: 5,
    },
    text: {
        fontSize: 14,
        color: '#666',
        marginVertical: 1,
    },
});