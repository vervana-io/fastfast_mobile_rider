/* eslint-disable react-native/no-inline-styles */
import ActionSheet, {
  ActionSheetRef,
  FlatList,
  ScrollView,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import {
  Box,
  Button,
  Center,
  ChevronLeftIcon,
  ChevronRightIcon,
  HStack,
  Pressable,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import dayjs, {Dayjs} from 'dayjs';

import {SheetHeader} from '@components/ui';
import {WIN_HEIGHT} from '../../config';
import {authStore} from '@store/auth';
import {formatter} from '@helpers/formatter';
import {observer} from 'mobx-react-lite';
import {transactionsStore} from '@store/transactions';
import {useIsFocused} from '@react-navigation/native';
import {useTransactions} from '@hooks/useTransactions';
import {useUser} from '@hooks/useUser';

export const Earnings = observer((props: SheetProps) => {
  const earningsSheetRef = useRef<ActionSheetRef>(null);
  const isFocused = useIsFocused();

  const {fetchTransactions, transactionStates} = useTransactions();
  const {} = useUser({enableFetchUser: true});
  const {transactionsData} = transactionStates;

  const {auth} = authStore;

  const transactionsDataStore = transactionsStore.transactions;

  const doFetchTransaction = useCallback(() => {
    fetchTransactions.mutate({
      per_page: 30,
    });
  }, []);

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        doFetchTransaction();
      }, 1000);
    }
  }, [isFocused]);

  const minDate = dayjs(auth.user?.created_at); // Set your minimum date here
  const startDate = dayjs().subtract(6, 'day'); // Set your start date here
  const maxDate = dayjs(); // Today's date

  const initialEndDate = startDate.add(6, 'day').isAfter(maxDate)
    ? maxDate
    : startDate.add(6, 'day');

  const [dateRange, setDateRange] = useState({
    startDate,
    endDate: initialEndDate,
  });

  const fetchDataByRange = (start: Dayjs, end: Dayjs) => {
    fetchTransactions.mutate(
      {
        from_date: formatter.formatDate(start, 'YYYY-MM-DD'),
        to_date: formatter.formatDate(end, 'YYYY-MM-DD'),
        per_page: 30,
      },
      {},
    );
    console.log('start', formatter.formatDate(start, 'YYYY-MM-DD'));
    console.log('end', formatter.formatDate(end, 'YYYY-MM-DD'));
  };

  const handlePrev = useCallback(() => {
    const newStartDate = dateRange.startDate.subtract(7, 'day');
    const newEndDate = dateRange.endDate.subtract(7, 'day');
    if (newStartDate.isBefore(minDate)) {
      setDateRange({startDate: minDate, endDate: minDate.add(6, 'day')});
      fetchDataByRange(minDate, minDate.add(6, 'day'));
    } else {
      setDateRange({startDate: newStartDate, endDate: newEndDate});
      fetchDataByRange(newStartDate, newEndDate);
    }
  }, [dateRange.endDate, dateRange.startDate, minDate]);

  const handleNext = useCallback(() => {
    const newStartDate = dateRange.startDate.add(7, 'day');
    const newEndDate = dateRange.endDate.add(7, 'day');
    if (newEndDate.isAfter(maxDate)) {
      setDateRange({
        startDate: maxDate.subtract(6, 'day').isBefore(minDate)
          ? minDate
          : maxDate.subtract(6, 'day'),
        endDate: maxDate,
      });
      fetchDataByRange(
        maxDate.subtract(6, 'day').isBefore(minDate)
          ? minDate
          : maxDate.subtract(6, 'day'),
        maxDate,
      );
    } else {
      setDateRange({startDate: newStartDate, endDate: newEndDate});
      fetchDataByRange(newStartDate, newEndDate);
    }
  }, [dateRange.endDate, dateRange.startDate, maxDate, minDate]);

  const Header = useCallback(
    () => (
      <Center>
        <HStack alignItems="center" space={4}>
          <Pressable onPress={handlePrev} p={4}>
            <ChevronLeftIcon size={5} />
          </Pressable>
          {/* <Text fontSize="lg">10 Apr - 17 Apr</Text> */}
          <Text>
            {dateRange.startDate.format('DD MMM')} -{' '}
            {dateRange.endDate.format('DD MMM')}
          </Text>
          <Pressable onPress={handleNext} p={4}>
            <ChevronRightIcon size={5} />
          </Pressable>
        </HStack>
        <VStack mt={4}>
          <Text textAlign="center" fontSize="xs">
            Earnings
          </Text>
          <Text
            textAlign="center"
            fontSize="2xl"
            fontWeight="bold"
            mb={2}
            color="themeLight.primary.base">
            ₦{formatter.formatCurrencySimple(auth.wallet?.balance ?? 0)}
          </Text>
          {/* <Text textAlign="center" fontSize="xs">
            Total orders
          </Text>
          <Text textAlign="center" fontSize="xs">
            0
          </Text> */}
        </VStack>
      </Center>
    ),
    [
      auth.wallet?.balance,
      dateRange.endDate,
      dateRange.startDate,
      handleNext,
      handlePrev,
    ],
  );

  const DataInfo = useCallback(
    () => (
      <VStack my={4}>
        <Text>Available Balance</Text>
        <Text fontSize="2xl" fontWeight="bold" mb={2} color="black">
          ₦{formatter.formatCurrencySimple(auth.wallet?.balance ?? 0)}
        </Text>
        <HStack space={2} mt={2}>
          <Button
            variant="outline"
            borderColor="themeLight.accent"
            rounded="full"
            onPress={() => SheetManager.show('WithdrawSheet')}
            px={5}>
            Withdraw
          </Button>
          {/* <Button
            variant="ghost"
            rounded="full"
            px={5}
            endIcon={<ChevronRightIcon />}>
            Payment history
          </Button> */}
        </HStack>
      </VStack>
    ),
    [auth.wallet?.balance],
  );

  const History = useCallback(
    () => (
      <VStack mt={4}>
        <Text color="themeLight.gray.2" fontSize="xs">
          Ride History
        </Text>
        <VStack mt={4} space={4}>
          {fetchTransactions.isLoading ? (
            <Center>
              <Spinner />
            </Center>
          ) : fetchTransactions.isError ? (
            <Center>
              <Text>We could not fetch transactions</Text>
              <Button py={4} mt={2} onPress={doFetchTransaction}>
                Try again
              </Button>
            </Center>
          ) : transactionsDataStore.length > 0 ? (
            <FlatList
              data={transactionsDataStore}
              renderItem={({item}) => (
                <Pressable
                  onPress={() =>
                    SheetManager.show('EarningsOrderSheet', {
                      payload: {data: item},
                    })
                  }
                  mb={6}>
                  <HStack
                    justifyContent="space-between"
                    borderBottomWidth={1}
                    borderBottomColor="themeLight.gray.4"
                    pb={2}>
                    <VStack>
                      <Text color="black" fontSize="md">
                        {/* {item.seller?.trading_name} */}
                        Order {item.reference}
                      </Text>
                      <Text color="themeLight.gray.2" fontSize="xs">
                        {formatter.formatDate(
                          item.created_at,
                          'DD - MMM : HH:mm a',
                        )}
                      </Text>
                    </VStack>
                    <HStack>
                      <Text color="themeLight.gray.2" fontSize="xs">
                        ₦
                        {formatter.formatCurrencySimple(
                          parseFloat(item.amount),
                        )}
                      </Text>
                      <ChevronRightIcon />
                    </HStack>
                  </HStack>
                </Pressable>
              )}
              keyExtractor={item => item.id.toString()}
            />
          ) : (
            <Center flex={1}>
              <Text>Transactions are empty</Text>
            </Center>
          )}
        </VStack>
        {/* <Center py={4}>
          <Button rounded="full" variant="ghost">
            View all
          </Button>
        </Center> */}
      </VStack>
    ),
    [
      doFetchTransaction,
      fetchTransactions.isError,
      fetchTransactions.isLoading,
      transactionsDataStore,
    ],
  );

  const Content = useCallback(() => {
    return (
      <Box py={6} px={4} bg="#fff" h="full" roundedTop="2xl">
        <SheetHeader
          sheetToClose="EarningsSheet"
          sheetType="1"
          title="Earnings"
        />
        <ScrollView>
          <VStack mt={4}>
            <Header />
            <DataInfo />
            <History />
          </VStack>
        </ScrollView>
      </Box>
    );
  }, [DataInfo, Header, History]);

  return (
    <ActionSheet
      id={props.sheetId}
      ref={earningsSheetRef}
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
