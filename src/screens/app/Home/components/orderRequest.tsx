import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Box, Button, Center, HStack, Text, VStack} from 'native-base';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {LocationPin} from '@assets/svg/LocationPin';
import {SheetManager} from 'react-native-actions-sheet';
import {SmilleyTear} from '@assets/svg/SmilleyTear';
import Toast from 'react-native-toast-message';
import {WIN_HEIGHT} from '../../../../config';
import {apiType} from '@types/index';
import {formatter} from '@helpers/formatter';
import {observer} from 'mobx-react-lite';
import {ordersStore} from '@store/orders';
import {useOrders} from '@hooks/useOrders';
import {subscribeToEvent} from '@handlers/pusherHandler';

export const OrderRequest = observer(() => {
  const NotificationOrder: any = ordersStore.notifiedOrder;
  const notification = NotificationOrder.data?.data;
  const notificationData = notification ? JSON.parse(notification) : null;
  const [showReassign, setShowReassign] = useState(false);
  const [showOrder, setShowOrder] = useState<boolean>(true);
  const [pusherOrder, setPusherOrder] = useState({});

  const [boxChangeableHeight, setBoxChangeableHeight] = useState(0);
  const boxHeight = useSharedValue(WIN_HEIGHT * boxChangeableHeight);

  const {acceptOrder, reassignOrder} = useOrders();

  console.log('NotificationOrder', NotificationOrder);

  const triggerReassign = () => {
    setShowReassign(true);
    setShowOrder(false);
  };

  const doReassign = () => {
    if (pusherOrder.order_id) {
      const order_id = pusherOrder.order_id;
      const request_id = NotificationOrder.data.request_id;
      if (order_id) {
        reassignOrder.mutate(
          {
            order_id,
            request_id,
          },
          {
            onSuccess: (val: apiType) => {
              if (val.status) {
                console.log('good', val);
                setShowReassign(false);
                setShowOrder(false);
                ordersStore.clearNotifiedOrder();
              } else {
                Toast.show({
                  type: 'warning',
                  text1: 'Order Request',
                  text2: val.message,
                });
                setShowOrder(false);
                ordersStore.clearNotifiedOrder();
              }
            },
          },
        );
      }
    }
  };

  const triggerAccept = useCallback(() => {
    if (pusherOrder.order_id) {
      const order_id = pusherOrder?.order_id;

      console.log('order_id', order_id);
      const request_id = NotificationOrder?.data?.request_id || '234';
      console.log('request_id', request_id);

      acceptOrder.mutate(
        {
          order_id,
          request_id,
        },
        {
          onSuccess: (val: apiType) => {
            if (val.status) {
              //clear notification and open order details sheet
              setShowOrder(false);
              ordersStore.clearNotifiedOrder();
              ordersStore.setSelectedOrderId(order_id);
              SheetManager.show('orderDetailsSheet', {
                payload: {order_id, request_id},
              });
            } else {
              Toast.show({
                type: 'warning',
                text1: 'Order Request',
                text2: val.message,
              });
            }
          },
        },
      );
    }
  }, [NotificationOrder?.data?.request_id, pusherOrder?.order_id]);

  const Request = useCallback(
    () => (
      <Box w="full" bg="#1B1B1B" rounded="xl" p={4}>
        <Center>
          <Text color="white" fontWeight="bold" fontSize="30px">
            ₦
            {formatter.formatCurrencySimple(
              parseInt(pusherOrder?.delivery_fee, 10),
            )}
          </Text>
          <Text color="white">{pusherOrder?.title}</Text>
          {/* <Text color="white">{pusherOrder.trading_name}</Text> */}
        </Center>
        <VStack mt={4}>
          <VStack>
            <HStack alignItems="center" space={2}>
              <Center
                w="16px"
                h="16px"
                ml={1}
                rounded="full"
                borderWidth={1}
                borderColor="white">
                <Box />
              </Center>
              <Text color="white" flex={1}>
                {pusherOrder?.address?.house_number}{' '}
                {pusherOrder?.address?.street} {pusherOrder?.address?.city}
              </Text>
            </HStack>
            <Box
              mx={2.5}
              my={1}
              h="30px"
              w="0.2px"
              borderWidth={1}
              borderStyle="dashed"
              borderColor="white"
            />
          </VStack>
          <VStack>
            <HStack alignItems="center" space={2}>
              <LocationPin fill="white" />
              <Text color="white" flex={1}>
                {pusherOrder?.customer_address?.house_number}{' '}
                {pusherOrder?.customer_address?.street}{' '}
                {pusherOrder?.customer_address?.city}
              </Text>
            </HStack>
          </VStack>
        </VStack>
        <HStack w="full" space={3} my={5}>
          <Button
            flex={1}
            rounded="full"
            isLoading={acceptOrder.isLoading}
            _text={{fontWeight: 'bold'}}
            onPress={triggerAccept}>
            Accept
          </Button>
          <Button
            flex={1}
            rounded="full"
            onPress={triggerReassign}
            _text={{fontWeight: 'bold', color: 'themeLight.primary.base'}}
            bg="white">
            Reject
          </Button>
        </HStack>
      </Box>
    ),
    [
      acceptOrder.isLoading,
      pusherOrder?.address?.city,
      pusherOrder?.address?.house_number,
      pusherOrder?.address?.street,
      pusherOrder?.customer_address?.city,
      pusherOrder?.customer_address?.house_number,
      pusherOrder?.customer_address?.street,
      pusherOrder?.delivery_fee,
      pusherOrder?.title,
      triggerAccept,
    ],
  );

  const Reassign = useCallback(
    () => (
      <Box w="full" bg="#1B1B1B" rounded="xl" p={4}>
        <Center>
          <SmilleyTear />
          <Text mt={4} color="white" fontWeight="bold" fontSize="18px">
            Reassign this order?
          </Text>
          <Text color="white" fontWeight="bold" textAlign="center" my={4}>
            If you can’t deliver this order, you can reassign it.
          </Text>
          <Button
            w="full"
            rounded="full"
            isLoading={reassignOrder.isLoading}
            _text={{fontWeight: 'bold'}}
            _pressed={{_text: {color: 'white'}}}
            onPress={doReassign}>
            Reassign Order
          </Button>
        </Center>
      </Box>
    ),
    [reassignOrder.isLoading],
  );

  const toggleBoxHeight = useCallback(() => {
    const he = 0.45;
    setBoxChangeableHeight(he);
    boxHeight.value = withTiming(showOrder ? WIN_HEIGHT * he : WIN_HEIGHT * 0, {
      duration: 300,
    });
    setShowOrder(!showOrder);
  }, []);

  const animatedBoxStyle = useAnimatedStyle(() => {
    return {
      height: boxHeight.value,
    };
  });

  useEffect(() => {
    setPusherOrder(notificationData);
    // setPusherOrder({
    //   order_id: '456',
    //   amount: 3900,
    //   delivery_pin: '4244',
    //   id: 1,
    //   pick_up_pin: '6302',
    //   reference: '#ORDER_1722718197643990',
    //   rider_id: 0,
    //   sub_total: 3400,
    //   delivery_fee: 400,
    //   title: 'Chicken Repulblic',
    //   address: {
    //     house_number: '2A',
    //     street: 'Abuja Street',
    //     city: 'Ilupeju, Lagos',
    //   },
    //   customer_address: {
    //     house_number: '13',
    //     street: 'Ajangbadi Street',
    //     city: 'Festac, Lagos',
    //   },
    // });
  }, []);

  useEffect(() => {
    subscribeToEvent(event => {
      if (event?.eventName === 'rider_new_order') {
        console.log('EventName', event);
        setPusherOrder(JSON.parse(event?.data));
      }
    });
  }, []);

  useEffect(() => {
    console.log('noti', notificationData);
    console.log('NotificationOrder', NotificationOrder);
    if (pusherOrder?.amount || notificationData?.amount) {
      // clearNotificationById(NotificationOrder.messageId);
      setTimeout(() => {
        toggleBoxHeight();
      }, 500);
    }
  }, [
    NotificationOrder,
    notificationData,
    pusherOrder?.amount,
    toggleBoxHeight,
  ]);

  return (
    <Animated.View style={[styles.box, animatedBoxStyle]}>
      <Box px={3}>
        {/* {notificationData?.amount && !showReassign && <Request />}  */}
        {pusherOrder?.amount || (notificationData?.amount && !showReassign) ? (
          <Request />
        ) : null}
        {showReassign && <Reassign />}
      </Box>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  box: {
    width: '100%',
    position: 'absolute',
    bottom: 70,
    zIndex: 2,
    padding: 0,
    justifyContent: 'flex-end',
  },
});
