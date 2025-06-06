import Geolocation from '@react-native-community/geolocation';
import {Alert, Linking, Platform} from 'react-native';

export const openGoogleMapsDirections = ({
  destinationLat,
  destinationLng,
}: {
  destinationLat: number;
  destinationLng: number;
}) => {
  Geolocation.getCurrentPosition(
    async position => {
      const {latitude, longitude} = position.coords;

      const origin = `${latitude},${longitude}`;
      const destination = `${destinationLat},${destinationLng}`;

      if (Platform.OS === 'android') {
        const androidUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
        const supported = await Linking.canOpenURL(androidUrl);
        if (supported) {
          Linking.openURL(androidUrl);
        } else {
          Alert.alert('Error', 'Google Maps is not available');
        }
      } else {
        const googleMapsUrl = `comgooglemaps://?saddr=${origin}&daddr=${destination}&directionsmode=driving`;
        const appleMapsUrl = `http://maps.apple.com/?saddr=${origin}&daddr=${destination}&dirflg=d`;

        const canOpenGoogleMaps = await Linking.canOpenURL('comgooglemaps://');
        if (canOpenGoogleMaps) {
          Linking.openURL(googleMapsUrl);
        } else {
          Linking.openURL(appleMapsUrl).catch(() =>
            Alert.alert('Error', 'Unable to open Apple Maps'),
          );
        }
      }
    },
    error => {
      Alert.alert('Location Error', 'Unable to get current location');
      console.error(error);
    },
    {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  );
};
