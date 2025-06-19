import {authStore} from '@store/auth';
import messaging from '@react-native-firebase/messaging';

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    getFcmToken();
  }
};

export const getInitialNotifications = async () => {
  messaging()
    .getInitialNotification()
    .then((remoteMessage: any) => {
      if (remoteMessage) {
        console.info(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );

      }
    });
};

export const getFcmToken = async () => {
  const fcmToken: any = await messaging().getToken();
  if (fcmToken) {
    authStore.setFcmToken(fcmToken);
    return fcmToken;
  } else {
  }
};

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
  
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        
      }
    });
};
