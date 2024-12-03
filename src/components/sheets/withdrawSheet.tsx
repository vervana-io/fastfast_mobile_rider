import ActionSheet, {
  ActionSheetRef,
  ScrollView,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import {
  AddIcon,
  Box,
  Button,
  Center,
  HStack,
  Pressable,
  Radio,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import React, {useCallback, useEffect, useRef, useState} from 'react';

import {Input} from '@components/inputs';
import {SheetHeader} from '@components/ui';
import Toast from 'react-native-toast-message';
import {WIN_HEIGHT} from '../../config';
import {apiType} from '@types/apiTypes';
/* eslint-disable react-native/no-inline-styles */
import {authStore} from '@store/auth';
import {bankAccountType} from '@types/bankTypes';
import {observer} from 'mobx-react-lite';
import {toastConfig} from '@helpers/toastConfig';
import {useBanks} from '@hooks/useBanks';
import {useTransactions} from '@hooks/useTransactions';

const BankList: bankAccountType[] = [
  {
    id: 1,
    account_name: 'Francisco Benjamin',
    account_number: '0242532470',
    bank_name: 'GTB',
    bank_code: '023',
    is_main: 0,
    status: 0,
  },
  {
    id: 2,
    account_name: 'Francisco Benjamin',
    account_number: '0242532470',
    bank_name: 'GTB',
    bank_code: '023',
    is_main: 0,
    status: 0,
  },
];

export const WithdrawSheet = observer((props: SheetProps) => {
  const WithdrawSheetRef = useRef<ActionSheetRef>(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [selectedBank, setSelectedBank] = useState<Partial<bankAccountType>>();

  const {listBankAccounts} = useBanks({listBankAccounts: true});
  const {doWithdrawal} = useTransactions();

  const [bankList, setBankList] = useState<bankAccountType[]>([]);

  useEffect(() => {
    console.log('=================banks list===================');
    console.log(listBankAccounts.data?.data);
    console.log('====================================');
    if (listBankAccounts.data?.data.length > 0) {
      setBankList(listBankAccounts.data.data);
    }
  }, [listBankAccounts.data]);

  const withdrawFunds = useCallback(() => {
    if (amount !== '' && parseInt(amount, 10) > 5000) {
      if (selectedBank?.id) {
        doWithdrawal.mutate(
          {
            amount: parseFloat(amount),
            bank_account_id: selectedBank?.id || 0,
          },
          {
            onSuccess: (val: apiType) => {
              if (val.status) {
                Toast.show({
                  type: 'success',
                  text1: 'Withdrawal',
                  text2: 'Withdrawal successful',
                });
                setAmount('');
                setError('');
                setSelectedBank({});
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Withdrawal',
                  text2: val.message,
                });
              }
            },
          },
        );
      } else {
        Toast.show({
          type: 'error',
          text1: 'Withdrawal',
          text2: 'Please select a bank account',
        });
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Withdrawal',
        text2: 'Please enter an amount greater than 5000',
      });
    }
  }, [amount, selectedBank?.id]);

  const openAddBankSheet = useCallback(async () => {
    const res = await SheetManager.show('AddBankSheet');
    if (res) {
      listBankAccounts.refetch();
    }
  }, []);

  const Content = useCallback(
    () => (
      <Box py={6} px={4} bg="#fff" h="full" roundedTop="2xl">
        <SheetHeader
          sheetToClose="WithdrawSheet"
          sheetType="1"
          title="Payout"
        />
        <ScrollView>
          <VStack mt={4}>
            <Box>
              <Input
                label="Enter amount"
                value={amount}
                onChangeText={(e: string) => setAmount(e)}
                keyboardType="number-pad"
                hasError={error !== ''}
                errorMessage={error}
              />
            </Box>

            {listBankAccounts.isFetching ? (
              <Center flex={1} mt={8}>
                <Spinner />
              </Center>
            ) : (
              <VStack mt={8} space={6}>
                <Text>Select account</Text>
                <VStack space={5}>
                  {bankList.map((el, i) => (
                    <Pressable key={i} onPress={() => setSelectedBank(el)}>
                      <HStack justifyContent="space-between">
                        <HStack alignItems="center" space={2}>
                          <Text fontWeight="bold" maxW="125px" isTruncated>
                            {el.account_name}
                          </Text>
                          <Text fontWeight="bold">{el.account_number}</Text>
                          <Text fontSize="xs" maxW="125px" isTruncated>
                            ({el.bank_name})
                          </Text>
                        </HStack>
                        <Box
                          p="2px"
                          w="17px"
                          h="17px"
                          borderColor={
                            selectedBank?.id === el.id
                              ? 'themeLight.accent'
                              : 'black'
                          }
                          borderWidth={1}
                          rounded="full">
                          {selectedBank?.id === el.id && (
                            <Box
                              bg="themeLight.accent"
                              w="full"
                              h="full"
                              rounded="full"
                            />
                          )}
                        </Box>
                      </HStack>
                    </Pressable>
                  ))}
                  <Button
                    w="56"
                    rounded="full"
                    variant="outline"
                    onPress={() => openAddBankSheet()}
                    leftIcon={<AddIcon />}>
                    Add new bank account
                  </Button>
                </VStack>
              </VStack>
            )}

            <Button
              w="full"
              rounded="60px"
              mt={8}
              py={4}
              isDisabled={amount === ''}
              onPress={withdrawFunds}
              isLoading={doWithdrawal.isLoading}
              isLoadingText="Processing..."
              bg="themeLight.accent"
              _text={{color: 'white', fontWeight: 'bold', fontFamily: 'body'}}>
              Withdraw funds
            </Button>
          </VStack>
        </ScrollView>
      </Box>
    ),
    [
      amount,
      bankList,
      doWithdrawal.isLoading,
      error,
      listBankAccounts.isFetching,
      openAddBankSheet,
      selectedBank?.id,
      withdrawFunds,
    ],
  );

  return (
    <ActionSheet
      id={props.sheetId}
      ref={WithdrawSheetRef}
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
      <Toast config={toastConfig} />
    </ActionSheet>
  );
});
