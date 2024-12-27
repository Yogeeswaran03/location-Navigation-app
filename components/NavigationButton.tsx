import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import openMap from 'react-native-open-maps';

const NavigationButton: React.FC = () => {
  const startNavigation = () => {
    openMap({
      latitude: 13.0827, 
      longitude: 80.2707,
      zoom: 16,
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Navigate to Destination" onPress={startNavigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default NavigationButton;
