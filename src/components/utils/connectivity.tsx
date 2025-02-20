import {Box, HStack, Spinner, Text, VStack} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';

import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import {WifiBallon} from '@assets/svg/WifiBallon';

export const Connectivity = () => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        // Toast.show({
        //   type: 'hasInternet',
        //   position: 'bottom',
        //   visibilityTime: 1000,
        // });
      } else {
        Toast.show({
          type: 'noInternet',
          position: 'bottom',
          autoHide: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
};
