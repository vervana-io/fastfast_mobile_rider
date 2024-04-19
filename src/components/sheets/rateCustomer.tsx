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
import {formatter} from '@helpers/formatter';
import {observer} from 'mobx-react-lite';

export const RateCustomerSheet = observer((props: SheetProps) => {
  const rateCustomerSheetRef = useRef<ActionSheetRef>(null);
  const [rating, setRating] = useState([1, 2, 3, 4, 5]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [message, setMessage] = useState('');

  const payload = props.payload;
  const {customer_id, delivery_fee} = payload;

  const handleRatingPress = (selected: number) => {
    setSelectedRating(selected);
  };

  const badRatingResponse = () => (
    <>
      <Text fontWeight="bold" mb={4}>
        Oh wow!
      </Text>
      <Text>What went wrong</Text>
      <HStack my={4} space={3} flexWrap="wrap">
        <Pressable bg="themeLight.gray.3" p={2} px={3} mb={4} rounded="full">
          <Text>Not Friendly</Text>
        </Pressable>
        <Pressable bg="themeLight.gray.3" p={2} px={3} mb={4} rounded="full">
          <Text>Agressive</Text>
        </Pressable>
        <Pressable bg="themeLight.gray.3" p={2} px={3} mb={4} rounded="full">
          <Text>Hard to locate</Text>
        </Pressable>
        <Pressable bg="themeLight.gray.3" p={2} px={3} mb={4} rounded="full">
          <Text>Bad communication</Text>
        </Pressable>
        <Pressable bg="themeLight.gray.3" p={2} px={3} mb={4} rounded="full">
          <Text>Very insulting</Text>
        </Pressable>
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
          onPress={() => SheetManager.hide('rateCustomerSheet')}
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
              How was your delivery with your customer, David?
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
            <Box mt={6}>{badRatingResponse()}</Box>
            <TextArea
              value={message}
              onChangeText={e => setMessage(e)}
              placeholder="Add additional comment or feedback"
              mt={3}
              autoCompleteType={undefined}
            />
            <Button rounded="full" _text={{fontWeight: 'bold'}} mt={4}>
              Submit
            </Button>
          </VStack>
        </ScrollView>
      </Box>
    );
  }, [message, rating, selectedRating]);

  return (
    <ActionSheet
      id={props.sheetId}
      ref={rateCustomerSheetRef}
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
      {Complete()}
    </ActionSheet>
  );
});
