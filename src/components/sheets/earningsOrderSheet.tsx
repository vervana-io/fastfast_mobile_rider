/* eslint-disable react-native/no-inline-styles */
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from 'react-native-actions-sheet';
import {Box, Divider, HStack, Text, VStack} from 'native-base';
import React, {useCallback, useRef} from 'react';

import {LocationPin3} from '@assets/svg/LocationPin3';
import {SheetHeader} from '@components/ui';
import {TransactionsType} from '@types/transactionsType';
import {WIN_HEIGHT} from '../../config';
import {formatter} from '@helpers/formatter';
import {observer} from 'mobx-react-lite';

export const EarningsOrderSheet = observer((props: SheetProps) => {
  const earningsOrderSheetRef = useRef<ActionSheetRef>(null);

  const payload: any = props.payload;
  const data: TransactionsType = payload.data;

  const Content = useCallback(() => {
    return (
      <Box py={6} px={4} bg="#fff" h="full" roundedTop="2xl">
        <SheetHeader sheetToClose="EarningsOrderSheet" title="Order" />
        <VStack mt={8} px={4}>
          <VStack space={2}>
            <HStack justifyContent="space-between">
              <Text>{data.reference}</Text>
              <Text fontSize="xs">
                {formatter.formatDate(
                  data.created_at,
                  'DD - MMM YYYY: HH:mm a',
                )}
              </Text>
            </HStack>
            <HStack space={4}>
              {/* <Text fontSize="xs">10:05 am - 10:20 am</Text> */}
              <HStack space={1} alignItems="center">
                <LocationPin3 width={15} height={15} />
                <Text fontSize="xs">Mowe</Text>
              </HStack>
              {/* <HStack space={1} alignItems="center">
                <BagIcon width={15} height={15} />
                <Text fontSize="xs">#4044</Text>
              </HStack> */}
            </HStack>
          </VStack>
          <VStack my={8} space={4}>
            <HStack justifyContent="space-between">
              <Text>Order Fee</Text>
              <Text color="themeLight.gray.2">
                ₦{formatter.formatCurrencySimple(parseFloat(data.amount))}
              </Text>
            </HStack>
            {/* <HStack justifyContent="space-between">
              <Text>Tip</Text>
              <Text color="themeLight.gray.2">₦0.00</Text>
            </HStack> */}
            <Divider orientation="horizontal" />
            <HStack justifyContent="space-between">
              <Text>total</Text>
              <Text color="themeLight.gray.2">
                ₦{formatter.formatCurrencySimple(parseFloat(data.amount))}
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    );
  }, [data.amount, data.created_at, data.reference]);

  return (
    <ActionSheet
      id={props.sheetId}
      ref={earningsOrderSheetRef}
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
