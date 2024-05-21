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
  CloseIcon,
  HStack,
  Pressable,
  Text,
  VStack,
} from 'native-base';
import React, {useCallback, useRef, useState} from 'react';

import {DangerIcon} from '@assets/svg/DangerIcon';
import {ExchangeIcon} from '@assets/svg/ExchangeIcon';
import {HouseIcon} from '@assets/svg/HouseIcon';
import {LocationPin} from '@assets/svg/LocationPin';
import {LocationPin2} from '@assets/svg/LocationPin2';
import {MobileIcon} from '@assets/svg/MobileIcon';
import {WIN_HEIGHT} from '../../config';
import {WeatherIcon} from '@assets/svg/WeatherIcon';
import {observer} from 'mobx-react-lite';

export interface ListType {
  id: number;
  title: string;
  icon: any;
}

const List: ListType[] = [
  {
    id: 1,
    title: 'Bad Weather',
    icon: <WeatherIcon />,
  },
  {
    id: 2,
    title: 'Reassignment',
    icon: <ExchangeIcon />,
  },
  {
    id: 3,
    title: 'Vehicle breakdown',
    icon: <DangerIcon />,
  },
  {
    id: 4,
    title: 'Pick up issues',
    icon: <LocationPin2 />,
  },
  {
    id: 5,
    title: 'Delivery point issues',
    icon: <HouseIcon />,
  },
  {
    id: 5,
    title: 'App problem',
    icon: <MobileIcon />,
  },
];

export const OrderHelpSheet = observer((props: SheetProps) => {
  const orderHelpSheetRef = useRef<ActionSheetRef>(null);

  const openComplaint = (data: ListType) => {
    SheetManager.show('ComplaintSheet', {payload: data});
  };

  const Content = useCallback(() => {
    return (
      <Box py={6} px={4} bg="#ffffff" h="full" roundedTop="2xl">
        <HStack alignItems="center">
          <Pressable onPress={() => SheetManager.hide('orderHelpSheet')}>
            <Box
              w={45}
              h={45}
              bg="themeLight.primary.base"
              opacity={0.1}
              rounded="lg"
            />
            <Pressable
              onPress={() => SheetManager.hide('orderHelpSheet')}
              position="absolute"
              zIndex={4}
              top={3}
              left={3}>
              <CloseIcon size={5} color="themeLight.primary.base" />
            </Pressable>
          </Pressable>
          <Text textAlign="center" fontWeight="bold" fontSize="lg" flex={1}>
            Need Help
          </Text>
        </HStack>
        <VStack mt={5} space={4}>
          <Text fontWeight="bold">Order issues</Text>
          {List.map((el, i) => (
            <Button
              key={i}
              bg="themeLight.gray.4"
              onPress={() => openComplaint(el)}
              leftIcon={el.icon}
              _icon={{marginRight: 10}}
              justifyContent="flex-start"
              alignItems="center"
              _text={{color: 'black'}}>
              {el.title}
            </Button>
          ))}
        </VStack>
      </Box>
    );
  }, []);

  return (
    <ActionSheet
      id={props.sheetId}
      ref={orderHelpSheetRef}
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
      {Content()}
    </ActionSheet>
  );
});
