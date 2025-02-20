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
      <Box safeAreaTop flex={1} bg="#009655">
        <StatusBar
          backgroundColor={statusBarColor}
          barStyle={'light-content'}
        />
        <KeyboardAvoiding
          refreshable={false}
          shouldRefresh={false}
          paddingBottom={0}>
          <Box bg="themeLight.primary.light2" flex={1}>
            {children}
          </Box>
        </KeyboardAvoiding>
      </Box>
    </>
  );
};
