import {Box, Button, Center, StatusBar, Text, VStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Alert, Modal, Platform} from 'react-native';
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from 'react-native-android-location-enabler';

import {LocationPin} from '@assets/svg/LocationPin';
import {KeyboardAvoiding} from '@components/utils';
import PermissionManager from '@handlers/permissionHandler';
import {layoutProps} from '@types/layoutsTypes';
import {AllBottomSheets} from '@components/gorhom';

export const DefaultLayout = (props: layoutProps) => {
  const {
    children,
    statusBarColor = 'white',
    checkPermissions = false,
    hasPermissionSet,
    refreshable = false,
    shouldRefresh,
    useKeyboardScroll = true,
  } = props;
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const _checkPermission = async () => {
      const checkPrems = await PermissionManager.checkPerms();
      if (Platform.OS === 'ios') {
        if (checkPrems !== 'granted') {
          setModalVisible(true);
        }
      } else {
        const checkEnabled: boolean = await isLocationEnabled();
        if (checkPrems !== 'granted' || !checkEnabled) {
          setModalVisible(true);
        }
      }
    };

    if (checkPermissions) {
      _checkPermission();
    }
  }, [checkPermissions]);

  async function enforceLocationPressed() {
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
            requestPerms();
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
                {text: 'OK', onPress: () => enforceLocationPressed()},
              ],
            );
          }
        }
      }
    } else {
      requestPerms();
    }
  }

  const requestPerms = async () => {
    const res = await PermissionManager.requestPermission('LOCATION');
    if (hasPermissionSet && res) {
      hasPermissionSet(res);
      setModalVisible(false);
    } else if (res) {
      setModalVisible(false);
    }
  };

  return (
    <>
      {Platform.OS === 'android' && <Box safeAreaTop bg={statusBarColor} />}
      <Box flex={1} bg="white">
        <StatusBar
          backgroundColor={statusBarColor}
          barStyle={
            statusBarColor === 'white' ? 'dark-content' : 'light-content'
          }
        />
        {useKeyboardScroll ? (
          <KeyboardAvoiding
            refreshable={refreshable}
            shouldRefresh={shouldRefresh}
            paddingBottom={0}>
            {children}
          </KeyboardAvoiding>
        ) : (
          children
        )}
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
                  onPress={() => enforceLocationPressed()}
                  rounded="full"
                  bg="themeLight.accent">
                  Set automatically
                </Button>
                {/* <Button
                  py={4}
                  _text={{fontWeight: 'bold', color: 'themeLight.accent'}}
                  w="full"
                  onPress={() => setModalVisible(false)}
                  rounded="full"
                  variant="ghost">
                  Set Later
                </Button> */}
              </VStack>
            </Center>
          </Box>
        </Modal>
        <AllBottomSheets />
      </Box>
    </>
  );
};
