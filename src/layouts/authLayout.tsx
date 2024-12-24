import {Box, StatusBar} from 'native-base';

import {KeyboardAvoiding} from '@components/utils';
import {Platform} from 'react-native';
import React from 'react';
import {layoutProps} from '@types/layoutsTypes';

export const AuthLayout = (props: layoutProps) => {
  const {children, statusBarColor = 'white'} = props;
  return (
    <>
      {Platform.OS === 'android' && <Box safeAreaTop bg={statusBarColor} />}
      <Box safeAreaTop flex={1} bg="white">
        <StatusBar
          backgroundColor={statusBarColor}
          barStyle={
            statusBarColor === 'white' ? 'dark-content' : 'light-content'
          }
        />
        <KeyboardAvoiding
          refreshable={false}
          shouldRefresh={false}
          paddingBottom={0}>
          {children}
        </KeyboardAvoiding>
      </Box>
    </>
  );
};
