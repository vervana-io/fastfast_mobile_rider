import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
// LocationPermissionHandler.ts
import {PermissionsAndroid, Platform} from 'react-native';
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from 'react-native-android-location-enabler';

import Geolocation from 'react-native-geolocation-service';

type LocationStatus = {
  status: 'granted' | 'denied' | 'blocked' | 'unavailable';
  location?: {
    latitude: number;
    longitude: number;
  };
};

export const requestLocationPermission = async (): Promise<LocationStatus> => {
  try {
    if (Platform.OS === 'android') {
      // Check if location services are enabled, and prompt the user to enable them if not
      const checkEnabled: boolean = await isLocationEnabled();
      if (!checkEnabled) {
        const enableResult = await promptForEnableLocationIfNeeded({
          interval: 10000,
          waitForAccurate: true,
        });
        if (enableResult === 'enabled' || enableResult === 'already-enabled') {
          // Request appropriate location permission based on platform
          const permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

          const permissionResult = await request(permission);

          if (permissionResult === RESULTS.GRANTED) {
            // Permissions granted, proceed to get location
            return new Promise((resolve, reject) => {
              Geolocation.getCurrentPosition(
                position => {
                  resolve({
                    status: 'granted',
                    location: {
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                    },
                  });
                },
                error => {
                  reject({
                    status: 'unavailable',
                    location: undefined,
                  });
                },
                {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
              );
            });
          } else {
            // Handle other permission states
            let status: 'denied' | 'blocked' = 'denied'; // Default to 'denied'
            if (permissionResult === RESULTS.BLOCKED) {
              status = 'blocked';
            }

            return {
              status,
              location: undefined,
            };
          }
        }
      }
    }
    // Request appropriate location permission based on platform
    const permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE

    const permissionResult = await request(permission);

    if (permissionResult === RESULTS.GRANTED) {
      // Permissions granted, proceed to get location
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => {
            resolve({
              status: 'granted',
              location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
            });
          },
          error => {
            reject({
              status: 'unavailable',
              location: undefined,
            });
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      });
    } else {
      // Handle other permission states
      let status: 'denied' | 'blocked' = 'denied'; // Default to 'denied'
      if (permissionResult === RESULTS.BLOCKED) {
        status = 'blocked';
      }

      return {
        status,
        location: undefined,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      status: 'unavailable',
      location: undefined,
    };
  }
};
