import {Alert, Platform} from 'react-native';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from 'react-native-android-location-enabler';

import PermissionManager from './permissionHandler';
import {useState} from 'react';

export const GeoLocate = () => {
  const [location, setLocation] = useState<GeoPosition | null>(null);
  const [hasPermission, setHasPermission] = useState<
    'denied' | 'granted' | null
  >(null);

  const checkPerms = async () => {
    const res = await PermissionManager.checkPerms();
    setHasPermission(
      res === 'denied' ? 'denied' : res === 'granted' ? 'granted' : null,
    );
    if (res === 'granted') {
      Geolocation.getCurrentPosition(
        position => {
          setLocation(position);
          console.log(position);
        },
        error => {
          // Alert.alert(`Code ${error.code}`, error.message);
          setLocation(null);
          console.log(error);
        },
        {
          accuracy: {
            android: 'high',
            ios: 'best',
          },
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 0,
          forceRequestLocation: true,
          forceLocationManager: true,
          showLocationDialog: true,
        },
      );
    }
  };

  return {
    geoStates: {
      location,
      hasPermission,
    },
    checkPerms,
  };
};
