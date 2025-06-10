/**
 * @format
 */

import App from './App';
import {AppRegistry} from 'react-native';
// import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});
notifee.registerForegroundService((notification) => {
  return new Promise(() => {
    // Long running task...
    console.log('====================================');
    console.log('task running');
    console.log('====================================');
  });
});
// ReactNativeForegroundService.register();
AppRegistry.registerComponent(appName, () => App);
