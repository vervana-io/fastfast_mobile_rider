/* eslint-disable react-native/no-inline-styles */
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import {
  Box,
  ChevronRightIcon,
  HStack,
  Link,
  Pressable,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import React, {useCallback, useRef} from 'react';

import {ContractIcon} from '@assets/svg/ContractIcon';
import {MapIcon} from '@assets/svg/MapIcon';
import {SheetHeader} from '@components/ui';
import {TrashIcon} from '@assets/svg/TrashIcon';
import {WIN_HEIGHT} from '../../config';
import {authStore} from '@store/auth';
import {observer} from 'mobx-react-lite';
import {useAuth} from '@hooks/useAuth';

interface settingsListType {
  title: string;
  icon: any;
  sheet: string;
}

const list: settingsListType[] = [
  {
    title: 'Contract Type',
    icon: <ContractIcon />,
    sheet: 'contractType',
  },
  //   {
  //     title: 'Map Settings',
  //     icon: <MapIcon />,
  //     sheet: '',
  //   },
  //   {
  //     title: 'Open in Maps',
  //     icon: <MapIcon />,
  //     sheet: '',
  //   },
  {
    title: 'Delete Account',
    icon: <TrashIcon fill="#757575" />,
    sheet: '',
  },
];

export const SettingsSheet = observer((props: SheetProps) => {
  const settingsSheetRef = useRef<ActionSheetRef>(null);

  const {logout} = useAuth();

  const openSheet = (sheet: string) => {
    SheetManager.show(sheet);
    // setTimeout(() => {
    //   SheetManager.hide('settingsSheet');
    // }, 500);
  };

  const doLogout = () => {
    logout.mutate(
      {},
      {
        onSuccess: () => {
          SheetManager.hide('settingsSheet');
          authStore.logout();
        },
      },
    );
  };

  const Content = useCallback(() => {
    return (
      <Box py={6} px={4} bg="#ffffff" h="full" roundedTop="2xl">
        <SheetHeader sheetToClose="settingsSheet" title="Settings" />
        <VStack mt={4}>
          {list.map((el, i) => (
            <Pressable key={i} onPress={() => openSheet(el.sheet)}>
              <HStack
                w="full"
                justifyContent="space-between"
                alignItems="center"
                py={4}
                px={4}>
                <HStack space={2} alignItems="center">
                  {el.icon}
                  <Text fontSize="md">{el.title}</Text>
                </HStack>
                <ChevronRightIcon />
              </HStack>
            </Pressable>
          ))}
        </VStack>
        <VStack mt={4} px={4} space={3}>
          <HStack alignItems="center">
            {logout.isLoading && <Spinner />}
            <Link
              _text={{
                fontFamily: 'body',
                fontWeight: 'bold',
                color: 'themeLight.error',
                fontSize: 'md',
              }}
              onPress={doLogout}
              isUnderlined={false}>
              Log Out
            </Link>
          </HStack>
          <Text color="themeLight.gray.2">Version 2.3</Text>
        </VStack>
      </Box>
    );
  }, [logout.isLoading]);

  return (
    <ActionSheet
      id={props.sheetId}
      ref={settingsSheetRef}
      indicatorStyle={{
        width: 0,
      }}
      gestureEnabled={true}
      containerStyle={{
        height: WIN_HEIGHT * 0.9,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: 'transparent',
        // backgroundColor: colorMode === 'dark' ? '#111827' : '#fff',
      }}>
      {Content()}
    </ActionSheet>
  );
});
