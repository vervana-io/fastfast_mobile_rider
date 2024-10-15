/* eslint-disable react-native/no-inline-styles */
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
  Text,
  TextArea,
  VStack,
} from 'native-base';
import React, {useCallback, useRef, useState} from 'react';

import {SheetHeader} from '@components/ui';
import {StarIcon} from '@assets/svg/StarIcon';
import {StarIcon2} from '@assets/svg/StarIcon2';
// import { StarIcon } from '@assets/svg/StarIcon';
import {WIN_HEIGHT} from '../../config';
import {authStore} from '@store/auth';
import {formatter} from '@helpers/formatter';
import {observer} from 'mobx-react-lite';
import {ordersStore} from '@store/orders';
import { useOrders } from '@hooks/useOrders';

interface ratingType {
  message: string;
  type: 'rider' | 'seller';
}

const badRating: ratingType[] = [
  {
    type: 'rider',
    message: 'Not Friendly',
  },
  {
    type: 'rider',
    message: 'Agressive',
  },
  {
    type: 'rider',
    message: 'Hard to relate',
  },
  {
    type: 'rider',
    message: 'Bad communication',
  },
  {
    type: 'rider',
    message: 'Very insulting',
  },
];

const goodRating: ratingType[] = [
  {
    type: 'rider',
    message: 'Friendly',
  },
  {
    type: 'rider',
    message: 'Generous',
  },
  {
    type: 'rider',
    message: 'Easy to Locate',
  },
  {
    type: 'rider',
    message: 'Polite',
  },
  {
    type: 'rider',
    message: 'Good communication',
  },
];

export const RateCustomerSheet = observer((props: SheetProps) => {
  const rateCustomerSheetRef = useRef<ActionSheetRef>(null);
  const [rating, setRating] = useState([1, 2, 3, 4, 5]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [message, setMessage] = useState('');
  const [showRating, setShowRating] = useState(true);

  const userD = authStore.auth;

  const payload: any = props.payload;
  const delivery_fee = payload?.delivery_fee ?? 0;
  const customer_id = payload?.customer_id ?? 0;
  // const {customer_id, delivery_fee} = payload;

  const {} = useOrders();

  const handleRatingPress = (selected: number) => {
    setSelectedRating(selected);
  };

  const doRating = () => {};

  const badRatingResponse = () => (
    <>
      <Text fontWeight="bold" mb={4}>
        Oh wow!
      </Text>
      <Text>What went wrong?</Text>
      <HStack my={4} space={3} flexWrap="wrap">
        {badRating.map((el, i) => (
          <Pressable
            bg="themeLight.gray.3"
            p={2}
            px={3}
            mb={4}
            rounded="full"
            onPress={() => setMessage(el.message)}
            key={i}>
            <Text>{el.message}</Text>
          </Pressable>
        ))}
      </HStack>
    </>
  );

  const goodRatingResponse = () => (
    <>
      <Text fontWeight="bold" mb={4}>
        Awesome!
      </Text>
      <Text>What went well?</Text>
      <HStack my={4} space={3} flexWrap="wrap">
        {goodRating.map((el, i) => (
          <Pressable
            bg="themeLight.gray.3"
            p={2}
            px={3}
            mb={4}
            rounded="full"
            onPress={() => setMessage(el.message)}
            key={i}>
            <Text>{el.message}</Text>
          </Pressable>
        ))}
      </HStack>
    </>
  );

  const Complete = useCallback(
    () => (
      <Box py={6} px={4} bg="#ffffff" h="full" roundedTop="2xl">
        <Center mt={8}>
          <Text fontWeight="bold" fontSize="xl" mb={12}>
            Great Job 👍
          </Text>
          <Text color="themeLight.gray.2">You just earned</Text>
          <Text color="themeLight.accent">
            ₦{formatter.formatCurrencySimple(delivery_fee ?? 0)}{' '}
            <AddIcon color="themeLight.accent" />{' '}
          </Text>
        </Center>
        <Button
          rounded="full"
          mt={8}
          onPress={() => {
            SheetManager.hide('rateCustomerSheet');
            SheetManager.hide('orderDetailsSheet');
            ordersStore.setSelectedOrder({});
            ordersStore.setSelectedOrderId(0);
          }}
          bg="themeLight.primary.base"
          _text={{fontWeight: 'bold'}}>
          Back home
        </Button>
      </Box>
    ),
    [delivery_fee],
  );

  const Content = useCallback(() => {
    return (
      <Box py={6} px={4} bg="#ffffff" h="full" roundedTop="2xl">
        <SheetHeader sheetToClose="rateCustomerSheet" title="Rating" />
        <ScrollView>
          <VStack mt={4} px={4}>
            <Text fontWeight="bold">
              How was your delivery with your customer,{' '}
              {userD.rider?.first_name}?
            </Text>
            <HStack mt={6} justifyContent="space-between">
              {rating.map(index => (
                <Pressable key={index} onPress={() => handleRatingPress(index)}>
                  {index <= selectedRating ? (
                    <StarIcon width={40} height={40} fill="#E9C51A" />
                  ) : (
                    <StarIcon2 width={40} height={40} />
                  )}
                </Pressable>
              ))}
            </HStack>
            {selectedRating >= 3 ? (
              <Box mt={6}>{goodRatingResponse()}</Box>
            ) : selectedRating < 3 && selectedRating > 0 ? (
              <Box mt={6}>{badRatingResponse()}</Box>
            ) : null}
            <TextArea
              value={message}
              onChangeText={e => setMessage(e)}
              placeholder="Add additional comment or feedback"
              mt={3}
              autoCompleteType={undefined}
            />
            <Button
              rounded="full"
              _text={{fontWeight: 'bold'}}
              mt={4}
              onPress={() => setShowRating(false)}>
              Submit
            </Button>
          </VStack>
        </ScrollView>
      </Box>
    );
  }, [message, rating, selectedRating, userD.rider?.first_name]);

  return (
    <ActionSheet
      id={props.sheetId}
      ref={rateCustomerSheetRef}
      indicatorStyle={{
        width: 0,
      }}
      gestureEnabled={true}
      closeOnPressBack={false}
      closeOnTouchBackdrop={false}
      containerStyle={{
        height: WIN_HEIGHT * 0.9,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: 'white',
        // backgroundColor: colorMode === 'dark' ? '#111827' : '#fff',
      }}>
      {showRating ? Content() : Complete()}
    </ActionSheet>
  );
});
