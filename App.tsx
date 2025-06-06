import './src/components/sheets/sheets';

/* eslint-disable react-native/no-inline-styles */
import {
  checkApplicationNotificationPermission,
  registerAppWithFCM,
  registerListenerWithFCM,
} from '@handlers/fcmHandler';
import {ColorMode, NativeBaseProvider, StorageManager} from 'native-base';
import React, {useEffect} from 'react';

import {NeedsUpdateModal} from '@components/ui';
import {ErrorFallback} from '@components/utils';
import {toastConfig} from '@helpers/toastConfig';
import {AppNavigator} from '@navigation/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';
import {authStore} from '@store/auth';
import {rootConfig} from '@store/root';
import {LogBox} from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import FlashMessage from 'react-native-flash-message';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {QueryClientProvider} from 'react-query';
import {rootClientQuery} from './src/config';
import {theme} from './theme';
import {Host} from 'react-native-portalize';

export default function App() {
  LogBox.ignoreLogs([
    'In React 18',
    'The native module for Flipper',
    'onAnimated',
    'If you do not provide children',
    'VirtualizedLists should',
    '[Reanimated] Reading from `value`',
    'This task',
  ]);

  crashlytics().log('App mounted.'); // firebase crashlytics
  const userId = authStore?.auth.user?.id ?? '';
  const userName = authStore?.auth.user?.username ?? '';
  const errorHandler = (error: Error, stackTrace: string) => {
    crashlytics().recordError(error);
    crashlytics().log(`Stack Trace: ${stackTrace}`);
    // crashlytics().log(`App build no: ${DeviceInfo.getBuildNumber()}`);
    // crashlytics().log(`App version no: ${DeviceInfo.getVersion()}`);
    crashlytics().setAttributes({
      isNewUser: rootConfig.newUser ? 'true' : 'false',
      id: userId.toString(),
      username: userName,
    });
    /* Log the error to an error reporting service */
    if (__DEV__) {
      console.log('ERROR_BOUNDARY', error, stackTrace);
    }
  };

  const colorModeManager: StorageManager = {
    get: async () => {
      try {
        let val = await AsyncStorage.getItem('@color-mode');
        return val === 'dark' ? 'dark' : 'light';
      } catch (e) {
        return 'light';
      }
    },
    set: async (value: ColorMode) => {
      try {
        await AsyncStorage.setItem('@color-mode', value);
      } catch (e) {
        console.log(e);
      }
    },
  };

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('token', token);
  };

  useEffect(() => {
    requestUserPermission();
    getToken();
  }, []);

  useEffect(() => {
    registerListenerWithFCM();
    registerAppWithFCM();
    checkApplicationNotificationPermission();
  }, []);

  return (
    <>
      <QueryClientProvider client={rootClientQuery}>
        <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
          <GestureHandlerRootView style={{flex: 1}}>
            <ErrorBoundary
              onError={errorHandler}
              FallbackComponent={ErrorFallback}>
              <Host>
                <AppNavigator />
              </Host>
            </ErrorBoundary>
            <Toast config={toastConfig} />
            <FlashMessage position="bottom" />
            <NeedsUpdateModal />
          </GestureHandlerRootView>
        </NativeBaseProvider>
      </QueryClientProvider>
    </>
  );
}
