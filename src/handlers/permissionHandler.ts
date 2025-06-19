import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';

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

  static async askForPostNotificationsPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return false;
    }
    if (Platform.Version < 33) {
      return false;
    } // Only request for Android versions 13 and above

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message: 'We need your permission to show you notifications',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      this.checkPerms();
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          'Notification has not been granted!',
          'Please long press on app icon, select App Info, select Notifications and enable all notifications.',
        );
      }
    } catch (e) {
      console.warn('requestPostNotificationsPermission error', e);
    }
    return false;
  }
}

export default PermissionManager;
