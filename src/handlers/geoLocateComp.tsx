/* eslint-disable react/react-in-jsx-scope */
import {Alert, Modal, Platform} from 'react-native';
import {Box, Button, Center, Text, VStack} from 'native-base';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from 'react-native-android-location-enabler';
import {useEffect, useState} from 'react';

import { GeoLocate } from './geoLocate';
import {LocationPin} from '@assets/svg/LocationPin';
import PermissionManager from './permissionHandler';

export const GeoLocateComp = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const {checkPerms, geoStates} = GeoLocate();
  const {hasPermission} = geoStates;

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const checkEnabled: boolean = await isLocationEnabled();
      if (checkEnabled) {
        requestPerms();
      } else {
        try {
          const enableResult = await promptForEnableLocationIfNeeded();
          // The user has accepted to enable the location services
          // data can be :
          //  - "already-enabled" if the location services has been already enabled
          //  - "enabled" if user has clicked on OK button in the popup
          if (
            enableResult === 'enabled' ||
            enableResult === 'already-enabled'
          ) {
            await PermissionManager.requestPermission('LOCATION');
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            // console.error(error.message);
            // The user has not accepted to enable the location services or something went wrong during the process
            // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
            // codes :
            //  - ERR00 : The user has clicked on Cancel button in the popup
            //  - ERR01 : If the Settings change are unavailable
            //  - ERR02 : If the popup has failed to open
            //  - ERR03 : Internal error
            Alert.alert(
              'Allow Location Service',
              'Enable location to allow location services',
              [
                // {
                //   text: 'Ask me later',
                //   onPress: () => {},
                // },
                {
                  text: 'Cancel',
                  onPress: () => {},
                  style: 'cancel',
                },
                {text: 'OK', onPress: () => requestPermission()},
              ],
            );
          }
        }
      }
    } else {
      requestPerms();
    }
  };

  const requestPerms = async () => {
    const res = await PermissionManager.requestPermission('LOCATION');
    if (res) {
      checkPerms();
      setModalVisible(false);
    }
  };

  useEffect(() => {
    const checkPermission = async () => {
      checkPerms();
      const check = hasPermission;
      if (check !== 'granted') {
        setModalVisible(true);
      } else {
        setModalVisible(false);
      }
    };

    checkPermission();
  }, [hasPermission]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
      }}>
      <Box bg="rgba(0,0,0, .1)" flex={1} justifyContent="flex-end" p={4}>
        <Center bg="white" w="full" rounded="md" p={4} px={4}>
          <Center
            bg="themeLight.primary.base"
            w="60px"
            h="60px"
            mb={3}
            rounded="full">
            <LocationPin fill="white" width={30} height={30} />
          </Center>
          <Text fontWeight="bold">Where are you?</Text>
          <Text fontWeight="bold">
            Set your location so we can assign orders for you based on your
            current location
          </Text>
          <VStack w="full" mt={6} space={2}>
            <Button
              py={4}
              _text={{fontWeight: 'bold'}}
              w="full"
              onPress={() => requestPermission()}
              rounded="full"
              bg="themeLight.accent">
              Set automatically
            </Button>
            <Button
              py={4}
              _text={{fontWeight: 'bold', color: 'themeLight.accent'}}
              w="full"
              onPress={() => setModalVisible(false)}
              rounded="full"
              variant="ghost">
              Set Later
            </Button>
          </VStack>
        </Center>
      </Box>
    </Modal>
  );
};
