import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';

import {Platform} from 'react-native';

class PermissionManager {
  static PERMISSIONS = {
    ANDROID: {
      // Add Android permissions here
      LOCATION: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    },
    IOS: {
      // Add iOS permissions here
      LOCATION: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    },
  };

  static async requestPermission(permissionType: 'LOCATION'): Promise<boolean> {
    let permission;

    if (Platform.OS === 'android') {
      permission = PermissionManager.PERMISSIONS.ANDROID[permissionType];
    } else if (Platform.OS === 'ios') {
      permission = PermissionManager.PERMISSIONS.IOS[permissionType];
    } else {
      return Promise.reject('Unsupported platform');
    }

    const result = await check(permission);

    if (result === RESULTS.DENIED) {
      const requestResult = await request(permission);

      if (requestResult === RESULTS.GRANTED) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    } else if (result === RESULTS.GRANTED) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  }

  static async checkPerms(): Promise<string> {
    let permission;

    if (Platform.OS === 'android') {
      permission = PermissionManager.PERMISSIONS.ANDROID.LOCATION;
    } else if (Platform.OS === 'ios') {
      permission = PermissionManager.PERMISSIONS.IOS.LOCATION;
    } else {
      return Promise.reject('Unsupported platform');
    }

    const result = await check(permission);
    return result;
  }
}

export default PermissionManager;
