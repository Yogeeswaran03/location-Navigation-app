import React, { useEffect, useState } from 'react';
import { StyleSheet, Alert, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

interface Location {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const MapComponent: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  const destination: Location = {
    latitude: 9.914606,
    longitude: 78.122604,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  const requestLocationPermission = async () => {
    try {
      console.log('Requesting location permission...');
      if (Platform.OS === 'ios') {
        const granted = await Geolocation.requestAuthorization('whenInUse');
        console.log('iOS Permission:', granted);
        return granted === 'granted';
      } else if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        console.log('Android Permission:', granted);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.error('Permission error:', err);
      return false;
    }
  };

  const fetchCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    setLoading(true);
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
        fetchRoute(latitude, longitude);
        setLoading(false);
      },
      (error) => {
        Alert.alert('Error', error.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchRoute = async (startLat: number, startLng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLat},${startLng}&destination=${destination.latitude},${destination.longitude}&key=google map api`
      );
      const data = await response.json();
      const points = decodePolyline(data.routes[0].overview_polyline.points);
      setRouteCoordinates(points);
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const decodePolyline = (encoded: string): Location[] => {
    let points: Location[] = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < encoded.length) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5, latitudeDelta: 0, longitudeDelta: 0 });
    }
    return points;
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  return (
    <MapView
      style={styles.map}
      initialRegion={currentLocation ?? destination}
    >
      {currentLocation && (
        <Marker coordinate={currentLocation} title="You are here" />
      )}
      <Marker coordinate={destination} title="Destination" />
      {routeCoordinates.length > 0 && (
        <Polyline coordinates={routeCoordinates} strokeWidth={4} />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default MapComponent;
