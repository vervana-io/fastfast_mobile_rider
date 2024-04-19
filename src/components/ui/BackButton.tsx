import {
  Box,
  Center,
  ChevronLeftIcon,
  Icon,
  IconButton,
  Pressable,
} from 'native-base';

import React from 'react';
import {useNavigation} from '@react-navigation/native';

export const BackButton = () => {
  const navigation: any = useNavigation();

  return (
    <Pressable onPress={() => navigation.goBack()}>
      <Box
        w={45}
        h={45}
        bg="themeLight.primary.base"
        opacity={0.1}
        rounded="lg"
      />
      <Pressable
        onPress={() => navigation.goBack()}
        position="absolute"
        zIndex={4}
        top={3}
        left={3}>
        <ChevronLeftIcon size={5} color="themeLight.primary.base" />
      </Pressable>
    </Pressable>
  );
};
