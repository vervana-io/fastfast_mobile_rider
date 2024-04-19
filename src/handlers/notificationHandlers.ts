import {authStore} from '@store/auth';
import messaging from '@react-native-firebase/messaging';

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken();
  }
};

// The call to getInitialNotification should happen within a React lifecycle method after mounting
export const getInitialNotifications = async () => {
  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then((remoteMessage: any) => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        // we use this to navigate to the respective page
        // assuming we pass a type of screen to navigate to
        console.log('message data type', remoteMessage.data.type);
      }
    });
};

export const getFcmToken = async () => {
  const fcmToken: any = await messaging().getToken();
  if (fcmToken) {
    console.log('token', fcmToken);
    authStore.setFcmToken(fcmToken);
    return fcmToken;
  } else {
    console.log('Failed', 'No token received');
  }
};

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    console.log('Background state', remoteMessage.notification);
    console.log('Message data', remoteMessage.data);
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        console.log('Remote message', remoteMessage.notification);
        console.log('Message data', remoteMessage.data);
      }
    });
};
