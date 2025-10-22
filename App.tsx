import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { StatusBar, SafeAreaView, StyleSheet } from 'react-native';

const App: React.FC = () => {
  return (
    <NavigationContainer>
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#007bff" />
            <RootNavigator />
        </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#007bff',
    }
});

export default App;