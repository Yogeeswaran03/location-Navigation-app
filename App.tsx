import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MapComponent from './components/MapComponent';
import NavigationButton from './components/NavigationButton';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <MapComponent />
      <NavigationButton />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
