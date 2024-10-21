/**
 * @format
 */

import App from './App';
import {AppRegistry} from 'react-native';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import messaging from '@react-native-firebase/messaging';
import {name} from './app.json';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});
ReactNativeForegroundService.register();
AppRegistry.registerComponent('FastFastRider', () => App);
