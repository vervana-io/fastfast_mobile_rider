import ActionSheet, {
  ActionSheetRef,
  ScrollView,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import {
  Box,
  Button,
  HStack,
  Link,
  Pressable,
  SearchIcon,
  Text,
  VStack,
} from 'native-base';
import React, {useCallback, useRef, useState} from 'react';

import {Input} from '@components/inputs';
import {SheetHeader} from '@components/ui';
import Toast from 'react-native-toast-message';
import {WIN_HEIGHT} from '../../config';
import {apiType} from '@types/apiTypes';
/* eslint-disable react-native/no-inline-styles */
import {bankTypes} from '@types/bankTypes';
import {observer} from 'mobx-react-lite';
import {toastConfig} from '@helpers/toastConfig';
import {useBanks} from '@hooks/useBanks';

export const AddBankSheet = observer((props: SheetProps) => {
  const AddBankSheetRef = useRef<ActionSheetRef>(null);

  const [bankName, setBankName] = useState<Partial<bankTypes>>({});
  const [accountNumber, setAccountNumber] = useState('');
  const [validatedName, setValidatedName] = useState<{
    account_number: string;
    account_name: string;
  }>();

  const {validateBank, storeBanks} = useBanks();

  const openBank = async () => {
    const banks = await SheetManager.show('bankSheet');
    if (banks) {
      setBankName(banks);
    }
  };

  const proceed = useCallback(() => {
    if (accountNumber === '') {
      Toast.show({
        type: 'error',
        text1: 'Bank Validation',
        text2: 'Please input your account number',
      });
    } else if (!bankName.id) {
      Toast.show({
        type: 'error',
        text1: 'Bank Validation',
        text2: 'Please select your bank',
      });
    } else {
      storeBanks.mutate(
        {
          account_name: validatedName?.account_name ?? '',
          account_number: validatedName?.account_number ?? '',
          bank_code: bankName.code ?? '',
          bank_name: bankName.name ?? '',
          is_main: 1,
        },
        {
          onSuccess: (val: apiType) => {
            if (val.status) {
              SheetManager.hide('AddBankSheet', {payload: true});
            } else {
              Toast.show({
                type: 'error',
                text1: 'Add Bank Account',
                text2: val.message,
              });
            }
          },
        },
      );
    }
  }, [
    accountNumber,
    bankName.code,
    bankName.id,
    bankName.name,
    storeBanks,
    validatedName?.account_name,
    validatedName?.account_number,
  ]);

  const doValidateBank = useCallback(
    (number: string) => {
      validateBank.mutate(
        {
          account_number: number,
          bank_code: bankName.code?.toString() ?? '',
        },
        {
          onSuccess: (val: apiType) => {
            if (val.status) {
              const data: any = val.data;
              setValidatedName(data);
            } else {
              Toast.show({
                type: 'warning',
                text1: 'Bank Validation',
                text2: 'We could not validate your account',
              });
            }
          },
        },
      );
    },
    [bankName.code],
  );

  const callValidate = useCallback(
    (val: string) => {
      setAccountNumber(val);
      if (val !== '') {
        if (val.length > 9) {
          doValidateBank(val);
        }
      }
    },
    [doValidateBank],
  );

  const Content = useCallback(
    () => (
      <Box py={6} px={4} bg="#fff" h="full" roundedTop="2xl">
        <SheetHeader
          sheetToClose="AddBankSheet"
          sheetType="1"
          title="Add Bank"
        />
        <ScrollView>
          <VStack space={1} my={6}>
            <Box w="full" mt={3}>
              <Pressable onPress={openBank}>
                <Box
                  borderWidth={1}
                  rounded="lg"
                  justifyContent="center"
                  px={4}
                  borderColor="themeLight.gray.3"
                  h="52px">
                  <HStack justifyContent="space-between">
                    <Text>
                      {bankName.id ? bankName.name : 'Choose your bank'}
                    </Text>
                    <SearchIcon color="themeLight.accent" size={5} />
                  </HStack>
                </Box>
              </Pressable>
            </Box>
            <Box mb={8} w="full" mt={3}>
              <Input
                label="Account Number"
                placeholder=""
                keyboardType="number-pad"
                value={accountNumber}
                py={4}
                onChangeText={e => callValidate(e)}
                // onEndEditing={() => doValidateBank()}
                caption={validatedName?.account_name}
              />
              {validateBank.isLoading && (
                <Box
                  bg="themeLight.primary.light1"
                  rounded="lg"
                  px={2}
                  position="absolute"
                  right={0}>
                  <Text>Validating...</Text>
                </Box>
              )}
              {validateBank.isError && !validateBank.isLoading && (
                <Link
                  isUnderlined={false}
                  bg="themeLight.primary.light1"
                  rounded="lg"
                  px={2}
                  position="absolute"
                  right={0}>
                  Try again
                </Link>
              )}
            </Box>
            <Button
              w="full"
              rounded="60px"
              py={4}
              mb={3}
              isDisabled={validatedName?.account_name ? false : true}
              onPress={proceed}
              isLoading={storeBanks.isLoading}
              isLoadingText="Processing..."
              bg="themeLight.accent"
              _text={{color: 'white', fontWeight: 'bold', fontFamily: 'body'}}>
              Add Bank Account
            </Button>
          </VStack>
        </ScrollView>
      </Box>
    ),
    [
      accountNumber,
      bankName.id,
      bankName.name,
      callValidate,
      proceed,
      storeBanks.isLoading,
      validateBank.isError,
      validateBank.isLoading,
      validatedName?.account_name,
    ],
  );

  return (
    <ActionSheet
      id={props.sheetId}
      ref={AddBankSheetRef}
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
