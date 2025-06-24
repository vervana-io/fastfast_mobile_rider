/**
 * @format
 */

import App from './App';
import {AppRegistry} from 'react-native';
// import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

messaging().setBackgroundMessageHandler(async remoteMessage => {});
notifee.registerForegroundService(notification => {
  return new Promise(() => {});
});
// ReactNativeForegroundService.register();
AppRegistry.registerComponent(appName, () => App);
