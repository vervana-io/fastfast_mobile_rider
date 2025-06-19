import {LocationPin} from '@assets/svg/LocationPin';
import {SmilleyTear} from '@assets/svg/SmilleyTear';
import {formatter} from '@helpers/formatter';
import {useOrders} from '@hooks/useOrders';
import {authStore} from '@store/auth';
import {bottomSheetStore} from '@store/bottom-sheet';
import {ordersStore} from '@store/orders';
import {apiType, notificationsType} from '@types/index';
import {observer} from 'mobx-react-lite';
import {Box, Button, Center, HStack, Text, VStack} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import {WIN_HEIGHT} from '../../../../config';
import {usePusher} from '../../../../hooks/usePusher';

export const OrderRequest = observer(() => {
  const {unsuscribe, subscribe} = usePusher();
  const NotificationOrder: any = ordersStore.notifiedOrder;
  const selectedOrder: any = ordersStore.selectedOrder;
  const userD = authStore.auth;
  const [showReassign, setShowReassign] = useState(false);
  const [showOrder, setShowOrder] = useState<boolean>(true);
  const [mainNotificationOrder, setMainNotificationOrder] =
    useState<Partial<notificationsType>>();

  const [boxChangeableHeight, setBoxChangeableHeight] = useState(0);
  const boxHeight = useSharedValue(WIN_HEIGHT * boxChangeableHeight);

  const {acceptOrder, reassignOrder} = useOrders();

  useEffect(() => {
    if (!bottomSheetStore.sheets.orderDetailsView) {
      setMainNotificationOrder({});
      setShowOrder(false);
      setShowReassign(false);
      // Reset any other local state here
    }
  }, [bottomSheetStore.sheets.orderDetailsView]);

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
                setShowReassign(false);
                setShowOrder(false);
                ordersStore.clearNotifiedOrder();
                setMainNotificationOrder({});
              } else {
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
              ordersStore.setSelectedOrderId(Number(order_id));
              bottomSheetStore.SetSheet('orderDetailsView', true);
              unsuscribe('private.orders.approved.userId');
              subscribe(`private.orders.ready.${order_id}`, (data: any) => {
                //waiting for when seller mark order this order to be ready
                //events - ready, arrival, pick up, delivered
                if (data.eventName === 'rider_order_pickup') {
                  Toast.show({
                    type: 'success',
                    text1: 'Order Ready for Pickup',
                    text2: 'Your order is ready for pickup',
                    swipeable: true,
                    visibilityTime: 6000,
                  });
                }
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
      <Box w="full" bg="#1B1B1B" rounded="xl" height={300} mt={-300} p={4}>
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
                {mainNotificationOrder?.data?.address.house_number}
                {mainNotificationOrder?.data?.address?.street}
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
                {mainNotificationOrder?.data?.customer_address?.house_number}
                {mainNotificationOrder?.data?.customer_address?.street}
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
      const order = allOrders.find(o => o.id === order_id);
      return order;
    },
    [allOrders],
  );

  useEffect(() => {
    if (NotificationOrder.data) {
      const data = NotificationOrder;
      // const notification_name = JSON.parse(data.data)?.notification_name;
      // here we check if the notification is for an order request
      // after which we then check if we already have the order accepted

      const CompleteNotification = JSON.parse(data.data);

      if (CompleteNotification.notification_name === 'order_request') {
        // first we check if the rider already has an ongoing order

        if (ordersStore.ongoingOrderCount < 1) {
          // here we check if an order is already being handled by the user
          // with this, the rider can only have one order at a time
          if (!checkForOrderById(data.order_id)) {
            const payload: notificationsType = {
              data: JSON.parse(
                data.data || {
                  notification_name: 'order_request',
                  order_id: selectedOrder?.id,
                  amount: selectedOrder?.total_amount,
                  delivery_pin: selectedOrder?.delivery_pin,
                  id: selectedOrder?.id,
                  pick_up_pin: selectedOrder?.pick_up_pin,
                  reference: selectedOrder?.reference,
                  rider_id: selectedOrder?.rider_id,
                  sub_total: selectedOrder?.sub_total,
                  delivery_fee: selectedOrder?.delivery_fee,
                  title: selectedOrder?.title ?? 'ADD TITLE',
                  address: selectedOrder?.address,
                  customer_address: selectedOrder?.receiver_street,
                },
              ),
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
        } else {
          ordersStore.clearNotifiedOrder();
        }
      } else {
        console.error('no order request');
      }
    }
  }, [NotificationOrder, checkForOrderById, toggleBoxHeight]);

  return (
    <Animated.View style={[styles.box, animatedBoxStyle]}>
      <Box px={3}>
        {/* {notificationData?.amount && !showReassign && <Request />}  */}
        {mainNotificationOrder?.data?.delivery_fee != null && !showReassign ? (
          <Request />
        ) : null}
        {/* {selectedOrder?.delivery_fee != null && !showReassign ? (
          <Request />
        ) : null} */}
        {/* <Request /> */}
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

// you stopped at trying to show the order request sheet.
