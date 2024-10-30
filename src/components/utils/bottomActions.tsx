import {Box, Button, HStack, Spinner, Text, VStack} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';

import {LocationPin2} from '@assets/svg/LocationPin2';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import {WifiBallon} from '@assets/svg/WifiBallon';

interface BottomActionsProps {
  show: boolean;
  navigation: any;
}

export const BottomActions = (props: BottomActionsProps) => {
  const {navigation, show} = props;

  const refresh = () => {
    navigation.navigate('Splashscreen');
  };

  return (
    show && (
      <Box position="absolute" zIndex={6} bottom={20} w="full" h="50px" px={4}>
        <Box bg="#2B2F2D" w="full" h="full" rounded="lg" shadow={4}>
          <HStack
            flex={1}
            justifyContent="space-between"
            alignItems="center"
            px={4}>
            <HStack alignItems="center" space={4}>
              <Box>
                <LocationPin2 width={30} height={30} stroke="#009655" />
              </Box>
              <VStack>
                <Text color="white" fontWeight="bold">
                  Location Service
                </Text>
                <Text color="white" fontWeight="medium" fontSize="xs">
                  We could not fetch location service
                </Text>
              </VStack>
            </HStack>
            <Button size="xs" _text={{fontWeight: 'bold'}} onPress={refresh}>
              Refresh
            </Button>
          </HStack>
        </Box>
      </Box>
    )
  );
};
