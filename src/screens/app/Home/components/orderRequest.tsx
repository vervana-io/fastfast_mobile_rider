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
import {clearNotificationById} from '@handlers/fcmHandler';
import {formatter} from '@helpers/formatter';
import {observer} from 'mobx-react-lite';
import {ordersStore} from '@store/orders';
import {useOrders} from '@hooks/useOrders';

export const OrderRequest = observer(() => {
  const NotificationOrder: any = ordersStore.notifiedOrder;
  const notification = NotificationOrder.data?.data;
  const notificationData = notification ? JSON.parse(notification) : null;
  const [showReassign, setShowReassign] = useState(false);
  const [showOrder, setShowOrder] = useState<boolean>(true);

  const [boxChangeableHeight, setBoxChangeableHeight] = useState(0);
  const boxHeight = useSharedValue(WIN_HEIGHT * boxChangeableHeight);

  const {acceptOrder, reassignOrder} = useOrders();

  const triggerReassign = () => {
    setShowReassign(true);
    setShowOrder(false);
  };

  const doReassign = () => {
    const order_id = notificationData.order_id;
    const request_id = NotificationOrder.data.request_id;
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
          }
        },
      },
    );
  };

  const triggerAccept = () => {
    const order_id = notificationData.order_id;
    const request_id = NotificationOrder.data.request_id;
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
  };

  const Request = useCallback(
    () => (
      <Box w="full" bg="#1B1B1B" rounded="xl" p={4}>
        <Center>
          <Text color="white" fontWeight="bold" fontSize="30px">
            ₦
            {formatter.formatCurrencySimple(
              parseInt(notificationData?.amount, 10),
            )}
          </Text>
          <Text color="white">{notificationData?.title}</Text>
          {/* <Text color="white">{notificationData.trading_name}</Text> */}
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
                {notificationData?.address?.house_number}{' '}
                {notificationData?.address?.street}{' '}
                {notificationData?.address?.city}
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
                {notificationData?.customer_address?.house_number}{' '}
                {notificationData?.customer_address?.street}{' '}
                {notificationData?.customer_address?.city}
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
      notificationData?.address?.city,
      notificationData?.address?.house_number,
      notificationData?.address?.street,
      notificationData?.amount,
      notificationData?.time,
      notificationData?.title,
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
    if (notificationData?.amount) {
      console.log('has notification', JSON.stringify(NotificationOrder));
      // clearNotificationById(NotificationOrder.messageId);
      setTimeout(() => {
        toggleBoxHeight();
      }, 500);
    }
  }, [NotificationOrder, notificationData, toggleBoxHeight]);

  return (
    <Animated.View style={[styles.box, animatedBoxStyle]}>
      <Box px={3}>
        {notificationData?.amount && !showReassign && <Request />}
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
