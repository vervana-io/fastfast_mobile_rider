/* eslint-disable react-native/no-inline-styles */
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import {
  Box,
  Button,
  Center,
  CheckIcon,
  CloseIcon,
  HStack,
  Image,
  Pressable,
  Text,
  VStack,
  useToast,
} from 'native-base';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';
import {CameraScreen, SheetHeader} from '@components/ui';
import React, {useCallback, useEffect, useRef, useState} from 'react';

import RNFS from 'react-native-fs';
import {StyleSheet} from 'react-native';
import Toast from 'react-native-toast-message';
import {WIN_HEIGHT} from '../../config';
import {apiType} from '@types/index';
import {launchImageLibrary} from 'react-native-image-picker';
import {uploadedOrderType} from '@types/generalType';
import {useCameraPermission} from 'react-native-vision-camera';
import {useUser} from '@hooks/useUser';

export const VerifyIdentitySheet = (props: SheetProps) => {
  const verifyIdentitySheetRef = useRef<ActionSheetRef>(null);
  const [uploadedOrder, setUploadedOrder] = useState<uploadedOrderType>();
  const [verified, setVerified] = useState(false);

  const device = useCameraDevice('front');
  const format = useCameraFormat(device, [
    {photoResolution: {width: 760, height: 480}},
  ]);

  const {hasPermission, requestPermission} = useCameraPermission();

  const toast = useToast();

  const {profileUpdate, userDetails} = useUser();

  const camera = useRef<Camera>(null);

  const updateAvatar = () => {
    profileUpdate.mutate(
      {
        selfie_base64: 'data:image/png;base64,' + uploadedOrder?.base64,
      },
      {
        onSuccess: (val: apiType) => {
          if (val.status) {
            toast.show({
              description: 'Avatar updated',
            });
            userDetails.refetch();
            setVerified(true);
          } else {
            Toast.show({
              text1: 'Profile update',
              text2: 'Avatar update failed, try again',
            });
          }
        },
      },
    );
  };

  const _snapPhotoPic = async () => {
    await launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        quality: 1,
      },
      (response: any) => {
        const payload: uploadedOrderType = {
          uri: response?.assets[0].uri ?? '',
          base64: response?.assets[0].base64 ?? '',
        };
        setUploadedOrder(payload);
        updateAvatar();
      },
    );
  };

  const rePerms = async () => {
    await requestPermission();
  };

  const retakePicture = () => {
    setUploadedOrder({});
  };

  const TakeShot = async () => {
    const photo = await camera?.current?.takePhoto({
      flash: 'on',
      enableShutterSound: true,
    });
    const photoPath = photo?.path;
    if (photoPath) {
      RNFS.readFile(photoPath, 'base64').then(res => {
        setUploadedOrder({
          base64: res,
          uri: photoPath,
        });
      });
    }
  };

  useEffect(() => {
    if (!hasPermission) {
      rePerms();
    }
  }, [hasPermission]);

  const VerifyDone = useCallback(
    () => (
      <Box w="full" h="full" py={6} px={4} bg="#ffffff">
        <SheetHeader sheetToClose="profileSheet" title="Verify your identity" />
        <Center px={5}>
          <Center
            w="104px"
            h="104px"
            my={6}
            borderWidth={5}
            rounded="full"
            borderColor="themeLight.primary.base">
            <CheckIcon size="10" color="themeLight.primary.base" />
          </Center>
          <Text fontWeight="bold">Your identity has been submitted</Text>
          <Text mt={3} textAlign="center" color="themeLight.gray.2">
            We will ask you to repeat this verification every 2 weeks to ensure
            your account is controlled by you.
          </Text>
        </Center>
      </Box>
    ),
    [],
  );

  const Content = useCallback(() => {
    return (
      <Box py={6} px={4} bg="#ffffff" h="full" roundedTop="2xl">
        <SheetHeader
          sheetToClose="verifyIdentitySheet"
          title="Verify your identity"
        />
        <Center p={8}>
          <Box
            w="140px"
            h="196px"
            rounded="full"
            overflow="hidden"
            borderWidth={1}
            borderColor="themeLight.gray.2">
            {(device !== null && uploadedOrder?.uri === null) ||
            uploadedOrder?.base64 === undefined ? (
              <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                format={format}
                photo={true}
                lowLightBoost={false}
                ref={camera}
                isActive={hasPermission}
              />
            ) : (
              <Image
                w="100%"
                h="100%"
                alt="verify"
                source={{uri: `data:image/png;base64,${uploadedOrder.base64}`}}
              />
            )}
          </Box>
          <Text mt={4} fontWeight="bold">
            Position your face in the oval shape
          </Text>
        </Center>
        {uploadedOrder?.uri ? (
          <Button
            w="full"
            py={4}
            rounded="full"
            mb={2}
            isLoading={profileUpdate.isLoading}
            isLoadingText="Submitting identity"
            onPress={updateAvatar}
            _text={{fontWeight: 'bold'}}>
            Verify
          </Button>
        ) : (
          <Button
            w="full"
            py={4}
            rounded="full"
            mb={2}
            onPress={TakeShot}
            _text={{fontWeight: 'bold'}}>
            Take Picture
          </Button>
        )}

        <Button
          w="full"
          py={4}
          rounded="full"
          bg="transparent"
          onPress={retakePicture}
          _text={{fontWeight: 'bold', color: 'themeLight.accent'}}>
          Retake Picture
        </Button>
        {!hasPermission && (
          <Center position="absolute" bottom={16} left={0} right={0}>
            <Button
              bg="themeLight.error"
              _text={{fontSize: 'xs'}}
              shadow={2}
              onPress={rePerms}>
              Camera permissions not set, click to allow
            </Button>
          </Center>
        )}
      </Box>
    );
  }, [
    device,
    format,
    hasPermission,
    profileUpdate.isLoading,
    updateAvatar,
    uploadedOrder?.base64,
    uploadedOrder?.uri,
  ]);

  return (
    <ActionSheet
      id={props.sheetId}
      ref={verifyIdentitySheetRef}
      indicatorStyle={{
        width: 0,
      }}
      gestureEnabled={true}
      containerStyle={{
        height: WIN_HEIGHT * 0.9,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: 'white',
        // backgroundColor: colorMode === 'dark' ? '#111827' : '#fff',
      }}>
      {verified ? VerifyDone() : Content()}
    </ActionSheet>
  );
};
