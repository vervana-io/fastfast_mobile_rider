import {ArrowBackIcon, Box, Center, Pressable, Text} from 'native-base';

import React from 'react';
import {SheetManager} from 'react-native-actions-sheet';

interface SheetHeaderProps {
  navigation?: any;
  sheetToClose?: string;
  title?: string;
}

export const SheetHeader = (props: SheetHeaderProps) => {
  const {navigation, sheetToClose, title} = props;

  const close = () => {
    if (sheetToClose) {
      if (navigation) {
        navigation();
      } else {
        SheetManager.hide(sheetToClose);
      }
    }
  };

  return (
    <Center py={4}>
      <Pressable
        position="absolute"
        onPress={close}
        top={3}
        left={3}
        zIndex={4}
        w="45px"
        h="44px">
        <Center
          rounded="2xl"
          opacity={0.1}
          bg="themeLight.accent"
          w="100%"
          h="100%"
        />
        <Center
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          rounded="2xl"
          zIndex={1}>
          <ArrowBackIcon color="themeLight.primary.base" size={4} />
        </Center>
      </Pressable>
      <Text fontSize="lg" fontWeight="bold">
        {title}
      </Text>
    </Center>
  );
};
