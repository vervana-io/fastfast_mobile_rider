import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import {
  Box,
  Button,
  Center,
  CheckCircleIcon,
  CloseIcon,
  FlatList,
  HStack,
  Heading,
  IconButton,
  Pressable,
  SearchIcon,
  Spinner,
  Text,
  VStack,
  useColorMode,
} from 'native-base';
import React, {useCallback, useEffect, useRef, useState} from 'react';

import {Input} from '@components/inputs';
/* eslint-disable react-native/no-inline-styles */
import {ScrollView} from 'react-native-gesture-handler';
import {WIN_HEIGHT} from '../../config';
import {bankTypes} from '@types/bankTypes';
import {observer} from 'mobx-react-lite';
import {useBanks} from '@hooks/useBanks';

export const BanksSheet = observer((props: SheetProps) => {
  const banksSheetRef = useRef<ActionSheetRef>(null);
  const {getBanks, bankList} = useBanks({fetchBanks: true});
  const [bankQuery, setBankQuery] = useState('');
  const [filteredBanks, setFilteredBanks] = useState<bankTypes[]>([]);

  const banksList: bankTypes[] = bankList;
  useEffect(() => {
    setFilteredBanks(banksList);
  }, [banksList]);

  const filteredBank = useCallback(
    (text: string) => {
      setBankQuery(text);
      if (text.length > 0) {
        const filter = banksList.filter(
          item =>
            item.name.toLowerCase().includes(text.toLowerCase()) ||
            item.code.includes(text),
        );
        setFilteredBanks(filter);
      } else {
        setFilteredBanks(banksList);
      }
    },
    [banksList],
  );

  const selectBank = (e: bankTypes) => {
    if (e.id) {
      SheetManager.hide('bankSheet', {payload: e});
    }
  };

  const {colorMode} = useColorMode();

  const Content = useCallback(() => {
    return (
      <Box p={2} px={4} h={WIN_HEIGHT * 0.89}>
        <HStack justifyContent="space-between" alignItems="center">
          <Heading fontSize="16px" fontWeight="bold" flex={1}>
            Choose Bank
          </Heading>
          <Box px={2} alignItems="flex-end">
            <IconButton
              icon={<CloseIcon />}
              onPress={() => SheetManager.hide('bankSheet')}
            />
          </Box>
        </HStack>
        <Box>
          <Box position="absolute" bottom={4} left={3} zIndex={1}>
            <SearchIcon />
          </Box>
          <Input
            label=""
            placeholder="Search for a bank"
            py={2}
            px={8}
            borderWidth={0}
            inputCustomStyle={{
              backgroundColor: colorMode === 'dark' ? 'transparent' : '#F6F6F6',
            }}
            value={bankQuery}
            onChangeText={(e: string) => filteredBank(e)}
          />
        </Box>
        {getBanks.isFetching && (
          <Center my={4}>
            <Spinner />
          </Center>
        )}
        <VStack flex={1} py={4} space={4}>
          <FlatList
            data={filteredBanks}
            renderItem={({item}) => (
              <Pressable onPress={() => selectBank(item)} py={2}>
                <HStack space={2} alignItems="center" mb={4}>
                  <Text fontSize="16px" fontWeight={400}>
                    {item.name}
                  </Text>
                </HStack>
              </Pressable>
            )}
            keyExtractor={item => item.id.toString()}
          />
        </VStack>
      </Box>
    );
  }, [bankQuery, colorMode, filteredBank, filteredBanks, getBanks.isFetching]);

  return (
    <ActionSheet
      id={props.sheetId}
      ref={banksSheetRef}
      indicatorStyle={{
        width: 0,
      }}
      containerStyle={{
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        backgroundColor: colorMode === 'dark' ? '#111827' : '#fff',
      }}>
      {Content()}
      {/* <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>

      </ScrollView> */}
    </ActionSheet>
  );
});
