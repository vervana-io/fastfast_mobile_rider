import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Box, Button, Center, HStack, Text, VStack} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {apiType, notificationsType, orderNotifications} from '@types/index';

import {LocationPin} from '@assets/svg/LocationPin';
import {PusherEvent} from '@pusher/pusher-websocket-react-native';
import {SheetManager} from 'react-native-actions-sheet';
import {SmilleyTear} from '@assets/svg/SmilleyTear';
import {StyleSheet} from 'react-native';
import Toast from 'react-native-toast-message';
import {UsePusher} from '@hooks/usePusher';
import {WIN_HEIGHT} from '../../../../config';
import {formatter} from '@helpers/formatter';
import {observer} from 'mobx-react-lite';
import {ordersStore} from '@store/orders';
import {useOrders} from '@hooks/useOrders';

export const OrderRequest = observer(() => {
  const NotificationOrder: any = ordersStore.notifiedOrder;
  // const notificationData = notification ? JSON.parse(notification) : null;
  const [showReassign, setShowReassign] = useState(false);
  const [showOrder, setShowOrder] = useState<boolean>(true);
  const [mainNotificationOrder, setMainNotificationOrder] =
    useState<Partial<notificationsType>>();

  const [boxChangeableHeight, setBoxChangeableHeight] = useState(0);
  const boxHeight = useSharedValue(WIN_HEIGHT * boxChangeableHeight);

  const {acceptOrder, reassignOrder} = useOrders();
  const {subscribe} = UsePusher();

  const allOrders = ordersStore.orders;

  const triggerReassign = useCallback(() => {
    setShowReassign(true);
    setShowOrder(false);
    setMainNotificationOrder(mainNotificationOrder);
  }, [mainNotificationOrder]);

  const doReassign = useCallback(() => {
    if (mainNotificationOrder?.order_id && mainNotificationOrder?.request_id) {
      const order_id = mainNotificationOrder.order_id;
      const request_id = mainNotificationOrder.request_id;
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
                setMainNotificationOrder({});
              } else {
                console.log('====================================');
                console.log(val);
                console.log('====================================');
                Toast.show({
                  type: 'warning',
                  text1: 'Order Request',
                  text2: val.message,
                });
                setShowOrder(false);
                // ordersStore.clearNotifiedOrder();
              }
            },
          },
        );
      }
    }
  }, [mainNotificationOrder]);

  const triggerAccept = useCallback(() => {
    if (mainNotificationOrder?.order_id) {
      const order_id = mainNotificationOrder?.order_id;

      const request_id = mainNotificationOrder?.request_id || '234';

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
              setMainNotificationOrder({});
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
  }, [
    acceptOrder,
    mainNotificationOrder?.order_id,
    mainNotificationOrder?.request_id,
  ]);

  const Request = useCallback(
    () => (
      <Box w="full" bg="#1B1B1B" rounded="xl" p={4}>
        <Center>
          <Text color="white" fontWeight="bold" fontSize="30px">
            ₦
            {formatter.formatCurrencySimple(
              mainNotificationOrder?.data?.delivery_fee ?? 0,
            )}
          </Text>
          <Text color="white">{mainNotificationOrder?.title}</Text>
          {/* <Text color="white">{mainNotificationOrder.trading_name}</Text> */}
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
                {mainNotificationOrder?.data?.address.house_number}{' '}
                {mainNotificationOrder?.data?.address?.street}{' '}
                {mainNotificationOrder?.data?.address?.city}
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
                {mainNotificationOrder?.data?.customer_address?.house_number}{' '}
                {mainNotificationOrder?.data?.customer_address?.street}{' '}
                {mainNotificationOrder?.data?.customer_address?.city}
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
      mainNotificationOrder?.data?.address?.city,
      mainNotificationOrder?.data?.address.house_number,
      mainNotificationOrder?.data?.address?.street,
      mainNotificationOrder?.data?.customer_address?.city,
      mainNotificationOrder?.data?.customer_address?.house_number,
      mainNotificationOrder?.data?.customer_address?.street,
      mainNotificationOrder?.data?.delivery_fee,
      mainNotificationOrder?.title,
      triggerAccept,
      triggerReassign,
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
    [doReassign, reassignOrder.isLoading],
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

  const checkForOrderById = useCallback(
    (order_id: number) => {
      console.log('checking order', order_id);
      const order = allOrders.find(o => o.id === order_id);
      console.log('order', order);
      return order;
    },
    [allOrders],
  );

  useEffect(() => {
    if (NotificationOrder.data) {
      const data = NotificationOrder;
      const notification_name = JSON.parse(data.data)?.notification_name;
      // here we check if the notification is for an order request
      // after which we then check if we already have the order accepted
      console.log('====================================');
      console.log(data);
      console.log(notification_name);
      console.log('====================================');
      if (notification_name === 'order_request') {
        if (!checkForOrderById(data.order_id)) {
          const payload: notificationsType = {
            data: JSON.parse(data.data),
            order_id: data.order_id ?? '',
            request_id: data.request_id ?? '',
            rider_id: data.rider_id ?? '',
            title: data.title ?? '',
            user_id: data.user_id ?? '',
          };
          setMainNotificationOrder(payload);
          setTimeout(() => {
            toggleBoxHeight();
          }, 500);
        }
      }
    }
  }, [NotificationOrder, checkForOrderById, toggleBoxHeight]);

  return (
    <Animated.View style={[styles.box, animatedBoxStyle]}>
      <Box px={3}>
        {/* {notificationData?.amount && !showReassign && <Request />}  */}
        {mainNotificationOrder?.data?.amount && !showReassign ? (
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
