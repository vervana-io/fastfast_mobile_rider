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

// The call to getInitialNotification should happen within a React lifecycle method after mounting
export const getInitialNotifications = async () => {
  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then((remoteMessage: any) => {
      if (remoteMessage) {
       
        // we use this to navigate to the respective page
        // assuming we pass a type of screen to navigate to
        
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

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        
      }
    });
};
