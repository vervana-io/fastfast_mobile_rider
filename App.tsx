import './src/components/sheets/sheets';

/* eslint-disable react-native/no-inline-styles */
import {
  Box,
  Center,
  ColorMode,
  HStack,
  Heading,
  NativeBaseProvider,
  StorageManager,
  Text,
} from 'native-base';
import React, {useEffect, useRef} from 'react';
import {
  checkApplicationNotificationPermission,
  registerAppWithFCM,
  registerListenerWithFCM,
} from '@handlers/fcmHandler';

import {AppNavigator} from '@navigation/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CheckMarkSolid} from '@assets/svg/CheckMarkSolid';
import {CloseIconSolid} from '@assets/svg/closeIconSolid';
import ErrorBoundary from 'react-native-error-boundary';
import {ErrorFallback} from '@components/utils';
import FlashMessage from 'react-native-flash-message';
import FlipperAsyncStorage from 'rn-flipper-async-storage-advanced';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {InfoIconSolid} from '@assets/svg/infoIconSolid';
import {LogBox} from 'react-native';
import {QueryClientProvider} from 'react-query';
import Toast from 'react-native-toast-message';
import {authStore} from '@store/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';
import {rootClientQuery} from './src/config';
import {rootConfig} from '@store/root';
import {theme} from './theme';
import {initializePusher} from '@handlers/pusherHandler';
import {requestLocationPermission} from '@handlers/LocationPermissionHandler';
import Geolocation from 'react-native-geolocation-service';

const toastConfig = {
  success: ({text1, props, text2}: any) => (
    <Box w="full" p="20px">
      <HStack
        h="82px"
        bg="white"
        rounded="lg"
        py={4}
        px={2}
        alignItems="center"
        justifyContent="space-between"
        space={2}>
        <Center w="32px" h="32px" bg="paypleGreen" rounded="full">
          <CheckMarkSolid />
        </Center>
        <Box flex={1}>
          <Heading size="sm" color="#135932">
            {text1}
          </Heading>
          <Text fontSize="14px" color="#135932">
            {text2}
          </Text>
        </Box>
      </HStack>
    </Box>
  ),

  error: ({text1, props, text2}: any) => (
    <Box w="full" p="20px">
      <HStack
        h="82px"
        bg="white"
        rounded="lg"
        py={4}
        px={2}
        alignItems="center"
        justifyContent="space-between"
        space={2}>
        <Center w="32px" h="32px" bg="danger.100" rounded="full">
          <CloseIconSolid />
        </Center>
        <Box flex={1}>
          <Heading size="sm" color="#D54444">
            {text1}
          </Heading>
          <Text fontSize="14px" color="#D54444">
            {text2}
          </Text>
        </Box>
      </HStack>
    </Box>
  ),

  warning: ({text1, props, text2}: any) => (
    <Box w="full" p="20px">
      <HStack
        h="82px"
        bg="white"
        rounded="lg"
        py={4}
        px={2}
        alignItems="center"
        justifyContent="space-between"
        space={2}>
        <Center w="32px" h="32px" bg="white" rounded="full">
          <InfoIconSolid />
        </Center>
        <Box flex={1}>
          <Heading size="sm" color="#B59900">
            {text1}
          </Heading>
          <Text fontSize="14px" color="#B59900">
            {text2}
          </Text>
        </Box>
      </HStack>
    </Box>
  ),

  info: ({text1, props, text2}: any) => (
    <Box w="full" p="20px">
      <HStack
        h="82px"
        bg="white"
        rounded="lg"
        py={4}
        px={2}
        alignItems="center"
        justifyContent="space-between"
        space={2}>
        <Center w="32px" h="32px" bg="white" rounded="full">
          <InfoIconSolid fill="#1d4ed8" />
        </Center>
        <Box flex={1}>
          <Heading size="sm" color="#60a5fa">
            {text1}
          </Heading>
          <Text fontSize="14px" color="#60a5fa">
            {text2}
          </Text>
        </Box>
      </HStack>
    </Box>
  ),
};

export default function App() {
  useEffect(() => {
    // Initialize Pusher
    initializePusher();

    // subscribeToEvent((event: any) => {
    //   const parsed = JSON.parse(event?.data);
    //   if (event?.eventName === 'customer_pick_up_order') {
    //     notificationStore.setRefetchOrder(parsed?.order_id);
    //     // console.log('EventName', parsed);
    //     Toast.show({
    //       type: 'info',
    //       text1: `${parsed?.title} for ${parsed?.seller_name}`,
    //       text2: parsed?.body,
    //     });
    //   }
    // });
  }, []);

  LogBox.ignoreLogs([
    'In React 18',
    'The native module for Flipper',
    'onAnimated',
    'If you do not provide children',
    'VirtualizedLists should',
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
      <FlipperAsyncStorage />
      <QueryClientProvider client={rootClientQuery}>
        <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
          <GestureHandlerRootView style={{flex: 1}}>
            <ErrorBoundary
              onError={errorHandler}
              FallbackComponent={ErrorFallback}>
              <AppNavigator />
            </ErrorBoundary>
            <Toast config={toastConfig} />
            <FlashMessage position="bottom" />
          </GestureHandlerRootView>
        </NativeBaseProvider>
      </QueryClientProvider>
    </>
  );
}
