import {Box, Button, Center, Image, Modal, Text, VStack} from 'native-base';
import {Linking, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import SpInAppUpdates, {
  IAUUpdateKind,
  NeedsUpdateResponse,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';

export const NeedsUpdateModal = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
  };

  const [needsUpdate, setNeedsUpdate] = useState<NeedsUpdateResponse>();

  const checkForUpdates = () => {
    const inAppUpdates = new SpInAppUpdates(false);

    // curVersion is optional if you don't provide it will automatically take from the app using react-native-device-info
    inAppUpdates
      .checkNeedsUpdate()
      .then(result => {
        if (result.shouldUpdate) {
          setNeedsUpdate(result);
          setModalVisible(true);
          // const updateOptions: StartUpdateOptions = Platform.select({
          //   ios: {
          //     title: '📢 New Update Available!',
          //     message:
          //       'We’ve made some exciting improvements to enhance your experience! Update now to enjoy the latest features!',
          //     buttonUpgradeText: 'Update Now',
          //     buttonCancelText: 'Cancel',
          //     updateType: IAUUpdateKind.IMMEDIATE,
          //     bundleId: 'org.fastfast',
          //     forceUpgrade: true,
          //   },
          //   android: {
          //     updateType: IAUUpdateKind.IMMEDIATE,
          //     title: '📢 New Update Available!',
          //     message:
          //       'We’ve made some exciting improvements to enhance your experience! Update now to enjoy the latest features!',
          //     buttonUpgradeText: 'Update Now',
          //     buttonCancelText: 'Cancel',
          //     bundleId: 'com.fastfast',
          //     forceUpgrade: true,
          //   },
          // });
          // inAppUpdates.startUpdate(updateOptions);
        } else {
          setNeedsUpdate(result);
          setModalVisible(false);
        }
      })
      .catch(err => {
        console.log('checkForUpdates ERROR ==>', err);
      });
  };

  // run checker for updates
  useEffect(() => {
    checkForUpdates();
  }, []);

  const openStoreLink = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL(
        needsUpdate?.other?.trackViewUrl ??
          'http://apps.apple.com/us/app/fastfast-rider/id6739758964',
      );
    } else {
      Linking.openURL(
        'https://play.google.com/store/apps/details?id=com.fastfastrider',
      );
    }
    closeModal();
  };

  return (
    <Modal isOpen={modalVisible} onClose={closeModal}>
      <Modal.Content w={Platform.OS === 'ios' ? 'full' : '90%'}>
        <Modal.CloseButton />
        <Modal.Body py={8}>
          <Center flex={1} p={4}>
            <Image
              alt="promotion"
              width="80px"
              height="80px"
              source={require('@assets/img/promotion.png')}
            />

            <VStack mt={4} space={4}>
              <Text textAlign="center" fontSize="2xl" fontWeight="semibold">
                New Update Available!
              </Text>
              <Text textAlign="center">
                We’ve made some exciting improvements to enhance your
                experience! Update now to enjoy the latest features!
              </Text>
              <Button
                onPress={openStoreLink}
                py={4}
                _text={{fontWeight: 'semibold'}}
                rounded="full">
                Update Now
              </Button>
            </VStack>
          </Center>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};
