import {
  Camera,
  useCameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';
import React, {useCallback, useEffect, useRef, useState} from 'react';

import {Box} from 'native-base';
import RNFS from 'react-native-fs';
import {StyleSheet} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

interface CameraProps {
  cameraType?: 'back' | 'external' | 'front';
}

export const CameraScreen = (props: CameraProps) => {
  const {cameraType = 'back'} = props;

  const device = useCameraDevice(cameraType);
  const format = useCameraFormat(device, [
    {photoResolution: {width: 760, height: 480}},
  ]);

  const isFocused = useIsFocused();

  const camera = useRef<Camera>(null);

  const TakeShot = async () => {
    const photo = await camera?.current?.takePhoto({
      flash: 'on',
      enableShutterSound: true,
    });
    const photoPath = photo?.path;
    if (photoPath) {
      RNFS.readFile(photoPath, 'base64').then(res => {
        console.log('test');
      });
    }
  };

  if (device == null) {
    return null;
  }

  return (
    <Box bg="black" w="full" h="full">
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        // format={format}
        photo={true}
        lowLightBoost={false}
        ref={camera}
        isActive={isFocused}
      />
    </Box>
  );
};
