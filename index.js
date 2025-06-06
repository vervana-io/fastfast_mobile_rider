/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
// import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {Provider} from 'react-redux';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import {name as appName} from './app.json';
import {store} from './src/redux/store';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});
notifee.registerForegroundService(notification => {
  return new Promise(() => {
    // Long running task...
    console.log('====================================');
    console.log('task running');
    console.log('====================================');
  });
});

let persistor = persistStore(store);

const Root = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
};

// ReactNativeForegroundService.register();
AppRegistry.registerComponent(appName, () => Root);
