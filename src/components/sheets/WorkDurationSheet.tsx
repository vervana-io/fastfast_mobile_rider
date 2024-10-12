import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
/* eslint-disable react-native/no-inline-styles */
import {
  Box,
  FlatList,
  HStack,
  Heading,
  Pressable,
  Text,
  VStack,
  useColorMode,
} from 'native-base';
import React, {useCallback, useRef, useState} from 'react';

import {MasterCardIcon} from '@assets/svgs/MastercardIcon';
import {VisaCardIcon} from '@assets/svgs/VisaCardIcon';

export interface workDurationTypes {
  name: string;
  label: string;
}

const workDuration: workDurationTypes[] = [
  {
    name: '1 month',
    label: '1',
  },
  {
    name: '1 - 3 months',
    label: '1-3',
  },
  {
    name: '4 - 6 months',
    label: '4-6',
  },
  {
    name: '7 - 12 months',
    label: '7-12',
  },
  {
    name: 'Over 1 year',
    label: '12+',
  },
];

export const WorkDurationSheet = (props: SheetProps) => {
  const workDurationSheetRef = useRef<ActionSheetRef>(null);
  const [selectedBrand, setSelectedCard] =
    useState<Partial<workDurationTypes>>();

  const {colorMode} = useColorMode();

  const selectBrand = (el: workDurationTypes) => {
    setSelectedCard(el);
    SheetManager.hide('WorkDurationSheet', {
      payload: el,
    });
  };

  const Content = useCallback(
    () => (
      <Box p={4}>
        <Box mt={6}>
          <FlatList
            data={workDuration}
            renderItem={({item}) => (
              <Pressable mb={2} onPress={() => selectBrand(item)}>
                <HStack
                  space={4}
                  bg={
                    selectedBrand?.name === item.name
                      ? 'blueGray.400'
                      : 'transparent'
                  }
                  _dark={{bg: 'dark.950'}}
                  p={2}
                  alignItems="center">
                  <VStack>
                    <Text fontWeight={600} textTransform="capitalize">
                      {item.name}
                    </Text>
                  </VStack>
                </HStack>
              </Pressable>
            )}
            keyExtractor={item => item.name}
          />
        </Box>
      </Box>
    ),
    [selectedBrand?.name],
  );

  return (
    <ActionSheet
      id={props.sheetId}
      ref={workDurationSheetRef}
      indicatorStyle={{
        width: 40,
      }}
      containerStyle={{
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: colorMode === 'dark' ? '#111827' : '#fff',
      }}
      gestureEnabled={true}>
      <Content />
    </ActionSheet>
  );
};
