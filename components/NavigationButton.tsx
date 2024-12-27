import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import openMap from 'react-native-open-maps';

const NavigationButton: React.FC = () => {
  const startNavigation = () => {
    openMap({
      start: "9.958592,78.188828", 
      end: " 9.914606,78.122604", 
      provider: "google", 
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={startNavigation}>
        <Text style={styles.buttonText}>Navigate to Destination</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NavigationButton;
