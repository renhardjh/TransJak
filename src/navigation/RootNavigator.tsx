import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { VehicleListScreen } from '../screens/vehicleListScreen';
import { VehicleDetailScreen } from '../screens/VehicleDetailScreen';

export type RootStackParamList = {
  VehicleList: undefined;
  VehicleDetail: { vehicleId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator 
        initialRouteName="VehicleList"
        screenOptions={{
            headerStyle: { backgroundColor: '#007bff' }, 
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
        }}
    >
      <Stack.Screen 
        name="VehicleList" 
        component={VehicleListScreen} 
        options={({ route }) => ({ 
            title: 'TransJak Fleet Tracker' 
        })} 
      />
      <Stack.Screen 
        name="VehicleDetail" 
        component={VehicleDetailScreen} 
        options={({ route }) => ({ 
            title: `Detail Kendaraan ${route.params.vehicleId}` 
        })} 
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;