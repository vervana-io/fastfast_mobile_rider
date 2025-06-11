/* eslint-disable react-native/no-inline-styles */
import {ExpandIcon} from '@assets/svg/Expand';
import {PhoneIcon} from '@assets/svg/PhoneIcon';
import {QuestionIcon} from '@assets/svg/QuestionIcon';
import TablerIcon from '@assets/svg/Tabler';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {toastConfig} from '@helpers/toastConfig';
import {useAppState} from '@hooks/useAppState';
import {useOrders} from '@hooks/useOrders';
import {bottomSheetStore} from '@store/bottom-sheet';
import {ordersStore} from '@store/orders';
import {apiType} from '@types/apiTypes';
import {uploadedOrderType} from '@types/generalType';
import {observer} from 'mobx-react-lite';
import {
  AddIcon,
  Box,
  Button,
  Center,
  CloseIcon,
  DeleteIcon,
  HStack,
  Image,
  Pressable,
  Text,
  VStack,
} from 'native-base';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, Linking, StyleSheet} from 'react-native';
import {SheetManager} from 'react-native-actions-sheet';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import {WIN_HEIGHT, WIN_WIDTH} from '../../../config';
import {UsePusher} from '@hooks/usePusher.ts';
export const OrderDetailsViewSheet = observer(() => {
  const sheetRef: any = useRef<BottomSheet>(null);
  const sheetOpen = bottomSheetStore.sheets.orderDetailsView;

  const [uploadedOrder, setUploadedOrder] = useState<uploadedOrderType[]>([]);
  const allowedUpload = 2;
  const [errorMessage, setErrorMessage] = useState('');
  // const [ordersData, setOrdersData] = useState<Partial<orderType>>({});
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [showFullPin, setShowFullPin] = useState(false);
  const [hasViewDetails, setViewDetails] = useState<'mid' | 'full' | 'small'>(
    'mid',
  );

  const {
    fetchSingleOrder,
    fetchOngoingOrders,
    pickUpOrder,
    arrivalOrder,
    deliveredOrder,
  } = useOrders();

  const {payload} = bottomSheetStore.sheetContentData;
  const order_id = payload?.order_id ?? ordersStore.selectedOrderId;
  const ordersData = ordersStore.selectedOrder;
  const request_id = payload?.request_id ?? ordersData?.misc_rider_info?.id;

  const {isBackground, isForeground, currentAppState} = useAppState();

  const {unsuscribe, subscribe} = UsePusher();
  // variables
  const snapPoints = useMemo(() => ['30%', '60%', '85%'], []);

  const NotificationOrder: any = ordersStore.notifiedOrder;

  const _snapPhotoPic = useCallback(async () => {
    if (uploadedOrder.length < allowedUpload) {
      await launchImageLibrary(
        {
          mediaType: 'photo',
          includeBase64: true,
          quality: 1,
          maxWidth: 320,
          maxHeight: 230,
        },
        (response: any) => {
          if (response) {
            if (response.assets && response.assets.length > 0) {
              const pay: uploadedOrderType = {
                uri: response?.assets[0]?.uri ?? '',
                base64: `data:image/jpeg;base64,${response?.assets[0]?.base64}`,
              };
              setUploadedOrder(prev => [...prev, pay]);
            }
          }
        },
      );
    }
  }, [uploadedOrder.length]);

  const removeImage = (i: number) => {
    setUploadedOrder(prev => {
      const newArr = [...prev];
      newArr.splice(i, 1);
      return newArr;
    });
  };

  const doArrival = useCallback(() => {
    setErrorMessage('');
    arrivalOrder.mutate(
      {
        order_id,
        request_id,
      },
      {
        onSuccess: (val: apiType) => {
          if (val.status) {
            getOrderInfo();
            // ordersStore.setArrival({has_arrived: true, order_id: order_id});
          } else {
            setErrorMessage(val.message);
            Toast.show({
              type: 'error',
              text1: 'Order Arrival',
              text2: val.message,
            });
          }
        },
      },
    );
  }, [order_id, request_id]);

  const doDelivered = useCallback(() => {
    const list: string[] = [];
    uploadedOrder.map(el => {
      list.push(el.base64);
    });
    setErrorMessage('');
    deliveredOrder.mutate(
      {
        order_id,
        request_id,
        media_base64: list,
      },
      {
        onSuccess: (val: apiType) => {
          if (val.status) {
            getOrderInfo();
            fetchOngoingOrders.mutate({
              page: 1,
              per_page: 6,
              status: '1',
            });
            unsuscribe(`private.orders.ready.${order_id}`);
            setUploadedOrder([]);
            const pay: any = {
              customer_id: ordersData.customer_id,
              delivery_fee: ordersData.delivery_fee,
              skip: true,
            };
            SheetManager.show('rateCustomerSheet', {payload: pay});
            bottomSheetStore.SetSheet('orderDetailsView', false);
          } else {
            Toast.show({
              type: 'error',
              text1: 'Order Delivery',
              text2: val.message,
            });
          }
        },
      },
    );
  }, [
    order_id,
    ordersData.customer_id,
    ordersData.delivery_fee,
    request_id,
    uploadedOrder,
  ]);

  const doPickUp = useCallback(() => {
    const list: string[] = [];
    uploadedOrder.map(el => {
      list.push(el.base64);
    });
    setErrorMessage('');
    pickUpOrder.mutate(
      {
        order_id,
        request_id,
        media_base64: list,
      },
      {
        onSuccess: (val: apiType) => {
          if (val.status) {
            getOrderInfo();
            setUploadedOrder([]);
          } else {
            Toast.show({
              type: 'error',
              text1: 'Order Pickup',
              text2: val.message,
            });
          }
        },
      },
    );
  }, [order_id, pickUpOrder, request_id, uploadedOrder]);

  const getOrderInfo = () => {
    fetchSingleOrder.mutate({id: order_id});
  };

  // firebase push notification
  useEffect(() => {
    if (NotificationOrder.data) {
      const data = NotificationOrder;
      console.log('NotificationOrder', data);
      const notification_name = data.data.notification_name;
      // here we check if the notification is for an order request
      // after which we then check if we already have the order accepted
      if (notification_name === 'order_pickup') {
        if (order_id === data.order_id) {
          getOrderInfo();
        }
      }
    }
  }, [NotificationOrder, order_id]);

  const callCustomer = useCallback(() => {
    if (ordersData.customer?.phone_number_one) {
      Linking.openURL(`tel:${ordersData.customer?.phone_number_one}`);
    }
  }, [ordersData.customer?.phone_number_one]);

  // callbacks
  // const handleSheetChanges = useCallback((index: number) => {
  //   console.log('handleSheetChanges', index);
  //   if (index === 2) {
  //     setViewDetails('full');
  //   } else if (index === 1) {
  //     setViewDetails('mid');
  //   } else {
  //     setViewDetails('small');
  //   }
  // }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    if (index === 2) {
      setViewDetails('full');
    } else if (index === 1) {
      setViewDetails('mid');
    } else {
      setViewDetails('small');
    }

    // Sync MobX store: if sheet is closed, set to false
    // For gorhom, index === -1 means fully closed; sometimes 0 is also used for closed
    if (index === -1 || index === 0) {
      bottomSheetStore.SetSheet('orderDetailsView', false);
    }
  }, []);

  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
  }, []);

  // renders
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={1}
        appearsOnIndex={2}
      />
    ),
    [],
  );

  const openGoogleMaps = useCallback(() => {
    let url = null;
    if (ordersData.picked_up_at) {
      const latitude = ordersData.address?.latitude;
      const longitude = ordersData.address?.longitude;
      url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    } else {
      const latitude = ordersData.seller?.latitude;
      const longitude = ordersData.seller?.longitude;
      url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    }

    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open Google Maps');
    });
  }, [
    ordersData.address?.latitude,
    ordersData.address?.longitude,
    ordersData.picked_up_at,
    ordersData.seller?.latitude,
    ordersData.seller?.longitude,
  ]);

  const Content = useCallback(() => {
    return (
      <Box>
        <HStack
          justifyContent="space-between"
          alignItems="flex-end"
          px={4}
          py={1}>
          <Box w="60px" h="23px">
            <Image
              alt="Google Logo"
              source={require('@assets/img/google_text_logo.png')}
              w="full"
              h="full"
            />
          </Box>
          <Pressable onPress={() => openGoogleMaps()}>
            <Center
              bg="themeLight.primary.light2"
              rounded="full"
              w="36px"
              h="36px">
              <TablerIcon />
            </Center>
          </Pressable>
        </HStack>
        <Box bg="themeLight.primary.base" roundedTop="2xl">
          <Pressable
            onPress={() =>
              hasViewDetails === 'mid'
                ? handleSnapPress(2)
                : hasViewDetails === 'small'
                ? handleSnapPress(1)
                : handleSnapPress(0)
            }>
            <Center py={1}>
              <Text color="white" fontWeight="bold">
                Swipe up to see more
              </Text>
            </Center>
          </Pressable>
          <Box bg="#1B1B1B" h="full" roundedTop="2xl">
            <Center p={4}>
              <Box bg="trueGray.400" w="12" h="1" rounded="full" />
            </Center>
            <Box py={6} px={4}>
              <HStack justifyContent="space-between" space={2}>
                <VStack flex={1} space={2}>
                  <Text fontWeight="bold" color="white" fontSize="lg">
                    {ordersData?.seller?.trading_name}
                  </Text>
                  <Text color="themeLight.gray.2" fontSize="xs">
                    {ordersData?.seller?.address ??
                      'Seller Address not Available'}
                  </Text>
                </VStack>
                <HStack space={2}>
                  <Button
                    leftIcon={<QuestionIcon />}
                    w="44px"
                    h="44px"
                    rounded="2xl"
                    onPress={() => SheetManager.show('orderHelpSheet')}
                    bg="white"
                    _pressed={{bg: 'rgba(255,255,255, .4)'}}
                  />
                  <Button
                    leftIcon={<PhoneIcon />}
                    w="44px"
                    h="44px"
                    rounded="2xl"
                    onPress={callCustomer}
                    bg="white"
                    _pressed={{bg: 'rgba(255,255,255, .4)'}}
                  />
                </HStack>
              </HStack>
              <Box mt={2}>
                {/* <Text color="white" fontWeight="bold">
                  Fee: ₦{ordersData?.sub_total}
                </Text> */}
                <Text color="white" fontWeight="bold">
                  Delivery Fee: ₦{ordersData?.delivery_fee}
                </Text>
                <Text color="white" fontWeight="bold">
                  Customer Address: {ordersData?.delivery_address}
                </Text>
                <Text color="white" fontWeight="bold">
                  Customer Name: {ordersData?.customer?.first_name}{' '}
                  {ordersData?.customer?.last_name}
                </Text>
                <VStack bg="white" rounded="lg" my={4} p={4} space={2}>
                  {ordersData.order_products &&
                    ordersData.order_products?.map((product_in_order, i) => (
                      <Text
                        key={
                          product_in_order.id || product_in_order.product?.id
                        }
                        color="black">
                        {product_in_order.quantity}x{' '}
                        {product_in_order.product?.title}
                      </Text>
                    ))}
                </VStack>
                {ordersData.status === 3 &&
                ordersData.is_rider_customer_arrived ? (
                  <Button
                    _text={{fontWeight: 'bold'}}
                    rounded="full"
                    variant="outline"
                    borderColor="themeLight.primary.base"
                    py={4}
                    isLoading={deliveredOrder.isLoading}
                    onPress={() => handleSnapPress(2)}>
                    I have delivered
                  </Button>
                ) : ordersData.status === 3 &&
                  ordersData.picked_up_at !== null ? (
                  <Button
                    _text={{fontWeight: 'bold'}}
                    rounded="full"
                    py={4}
                    isLoading={arrivalOrder.isLoading}
                    isLoadingText="Setting arrival"
                    isDisabled={arrivalOrder.isLoading}
                    onPress={doArrival}>
                    I have arrived
                  </Button>
                ) : (
                  <Button
                    _text={{fontWeight: 'bold'}}
                    rounded="full"
                    py={4}
                    onPress={() => handleSnapPress(2)}>
                    Proceed to pickup
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }, [
    arrivalOrder.isLoading,
    callCustomer,
    deliveredOrder.isLoading,
    doArrival,
    handleSnapPress,
    hasViewDetails,
    openGoogleMaps,
    ordersData?.delivery_fee,
    ordersData.is_rider_customer_arrived,
    ordersData.order_products,
    ordersData.picked_up_at,
    ordersData?.seller?.address,
    ordersData?.seller?.trading_name,
    ordersData.status,
  ]);

  const ContentFull = useCallback(
    () => (
      <Box py={6} px={4} bg="white" h="full" roundedTop="2xl">
        <Pressable onPress={() => handleSnapPress(1)}>
          <Box
            w={45}
            h={45}
            bg="themeLight.primary.base"
            opacity={0.1}
            rounded="lg"
          />
          <Pressable
            accessibilityLabel="Close sheet"
            accessibilityRole="button"
            onPress={() => handleSnapPress(1)}
            position="absolute"
            zIndex={4}
            top={3}
            left={3}>
            <CloseIcon size={5} color="themeLight.primary.base" />
          </Pressable>
        </Pressable>
        <BottomSheetScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}>
          <VStack mt={4}>
            <Text color="themeLight.error">{errorMessage}</Text>
            <VStack space={1}>
              <Text fontWeight="bold" color="black" fontSize="lg">
                {ordersData?.seller?.trading_name}
              </Text>
              <Text color="themeLight.gray.2" fontSize="xs">
                {ordersData?.seller?.address ?? 'Seller Address not Available'}
              </Text>
            </VStack>
            <VStack space={1} mt={5}>
              <Text fontWeight="bold" color="black" fontSize="xs">
                {'Customer Address'}
              </Text>
              <Text color="themeLight.gray.2" fontSize="lg">
                {ordersData?.delivery_address}
              </Text>
            </VStack>
            <VStack space={1} mt={5}>
              <Text fontWeight="bold" color="black" fontSize="xs">
                {'Customer Name'}
              </Text>
              <Text color="themeLight.gray.2" fontSize="lg">
                {`${ordersData?.customer?.first_name} ${ordersData?.customer?.last_name}`}
              </Text>
            </VStack>
            <HStack justifyContent="space-between" alignItems="center" mt={2}>
              <VStack>
                <Text fontWeight="bold" fontSize="md">
                  Order #
                  {ordersData?.status && ordersData?.status >= 3
                    ? ordersData?.delivery_pin
                    : ordersData?.pick_up_pin}
                </Text>
                <Text fontSize="xs" fontWeight="bold" color="themeLight.accent">
                  {ordersData?.order_products?.length} Items
                </Text>
              </VStack>
              <Pressable
                onPress={() => {
                  setShowFullPin(true);
                }}>
                <ExpandIcon />
              </Pressable>
            </HStack>
            <VStack bg="themeLight.gray.4" rounded="lg" my={4} p={4} space={2}>
              {ordersData.order_products &&
                ordersData.order_products?.map((el, i) => (
                  <Text key={i} color="black">
                    {el.quantity}x {el.product?.title}
                  </Text>
                ))}
            </VStack>
            <HStack space={2}>
              {/* <VStack>
                <Text fontWeight="bold">Fee</Text>
                <Text color="themeLight.gray.2" fontWeight="light">
                  ₦{ordersData?.sub_total}
                </Text>
              </VStack>
              <Divider orientation="vertical" mx={2} /> */}
              <VStack>
                <Text fontWeight="bold">Deliver Fee</Text>
                <Text color="themeLight.gray.2" fontWeight="light">
                  ₦{ordersData?.delivery_fee}
                </Text>
              </VStack>
            </HStack>
            <VStack mt={2}>
              <Text>Note from business</Text>
              <Text fontWeight="hairline" color="themeLight.gray.2">
                {ordersData.order_detail}.{' '}
              </Text>
            </VStack>
            {ordersData.status && ordersData.status < 3 ? (
              <>
                <VStack mt={2}>
                  <HStack alignItems="center" space={1}>
                    <Text fontWeight="bold">Photos</Text>
                    <Text fontWeight="hairline" fontSize="xs">
                      ({uploadedOrder.length}/{allowedUpload})
                    </Text>
                  </HStack>
                  <HStack mt={2} space={2}>
                    {uploadedOrder.map((el, i) => (
                      <Center
                        bg="themeLight.gray.4"
                        w="90px"
                        h="114px"
                        rounded="md"
                        key={i}>
                        <Pressable
                          onPress={() => removeImage(i)}
                          position="absolute"
                          top={2}
                          right={2}
                          bg="red.50"
                          w="20px"
                          h="20px"
                          zIndex={1}
                          rounded="md">
                          <Center flex={1}>
                            <DeleteIcon color="red.600" size="xs" />
                          </Center>
                        </Pressable>
                        <Image
                          width="100%"
                          height="100%"
                          alt="Image"
                          rounded="md"
                          source={{uri: el.uri}}
                        />
                      </Center>
                    ))}
                    <Pressable onPress={() => _snapPhotoPic()}>
                      <Center
                        bg="themeLight.gray.4"
                        w="90px"
                        h="114px"
                        rounded="md">
                        <Center>
                          <AddIcon />
                          <Text mt={3} fontSize="xs">
                            Add more
                          </Text>
                        </Center>
                      </Center>
                    </Pressable>
                  </HStack>
                </VStack>
                <Button
                  _text={{fontWeight: 'bold'}}
                  rounded="full"
                  py={4}
                  mt={3}
                  isLoading={
                    pickUpOrder.isLoading || fetchSingleOrder.isLoading
                  }
                  isLoadingText={
                    pickUpOrder.isLoading ? 'Updating records' : ''
                  }
                  onPress={doPickUp}>
                  Pick up order
                </Button>
              </>
            ) : ordersData.status === 3 &&
              ordersData.is_rider_customer_arrived === 0 ? (
              <Button
                _text={{fontWeight: 'bold'}}
                rounded="full"
                py={4}
                mt={3}
                isLoading={arrivalOrder.isLoading}
                onPress={doArrival}>
                I have arrived
              </Button>
            ) : ordersData.status === 3 &&
              ordersData.is_rider_customer_arrived === 1 ? (
              <>
                <VStack mt={2}>
                  <HStack alignItems="center" space={1}>
                    <Text fontWeight="bold">Photos</Text>
                    <Text fontWeight="hairline" fontSize="xs">
                      ({uploadedOrder.length}/{allowedUpload})
                    </Text>
                  </HStack>
                  <HStack mt={2} space={2}>
                    {uploadedOrder.map((el, i) => (
                      <Center
                        bg="themeLight.gray.4"
                        w="90px"
                        h="114px"
                        rounded="md"
                        key={i}>
                        <Pressable
                          onPress={() => removeImage(i)}
                          position="absolute"
                          top={2}
                          right={2}
                          bg="red.50"
                          w="20px"
                          h="20px"
                          zIndex={1}
                          rounded="md">
                          <Center flex={1}>
                            <DeleteIcon color="red.600" size="xs" />
                          </Center>
                        </Pressable>
                        <Image
                          width="100%"
                          height="100%"
                          alt="Image"
                          rounded="md"
                          source={{uri: el.uri}}
                        />
                      </Center>
                    ))}
                    <Pressable onPress={() => _snapPhotoPic()}>
                      <Center
                        bg="themeLight.gray.4"
                        w="90px"
                        h="114px"
                        rounded="md">
                        <Center>
                          <AddIcon />
                          <Text mt={3} fontSize="xs">
                            Add more
                          </Text>
                        </Center>
                      </Center>
                    </Pressable>
                  </HStack>
                </VStack>
                <Button
                  _text={{fontWeight: 'bold'}}
                  rounded="full"
                  py={4}
                  mt={3}
                  variant="outline"
                  borderColor="themeLight.primary.base"
                  isLoading={deliveredOrder.isLoading}
                  isLoadingText="Setting delivery"
                  isDisabled={deliveredOrder.isLoading}
                  onPress={doDelivered}>
                  I have delivered
                </Button>
              </>
            ) : null}
          </VStack>
        </BottomSheetScrollView>
      </Box>
    ),
    [
      _snapPhotoPic,
      arrivalOrder.isLoading,
      deliveredOrder.isLoading,
      doArrival,
      doDelivered,
      doPickUp,
      errorMessage,
      fetchSingleOrder.isLoading,
      handleSnapPress,
      ordersData?.delivery_fee,
      ordersData?.delivery_pin,
      ordersData.is_rider_customer_arrived,
      ordersData.order_detail,
      ordersData.order_products,
      ordersData?.pick_up_pin,
      ordersData?.seller?.address,
      ordersData?.seller?.trading_name,
      ordersData.status,
      pickUpOrder.isLoading,
      uploadedOrder,
    ],
  );

  const OrderComplete = useMemo(
    () => (
      <Box py={6} px={4} bg="#fff" h="full" roundedTop="2xl">
        <Center my={8}>
          <Text fontSize="2xl" fontWeight="semibold" mb={8}>
            Great Job 👍
          </Text>
          <Text fontSize="sm" color="themeLight.gray.2">
            You just earned
          </Text>
          <HStack mb={40}>
            <Text
              fontWeight="bold"
              fontSize="3xl"
              color="themeLight.primary.base">
              ₦1,700
            </Text>
            <AddIcon color="themeLight.primary.base" />
          </HStack>
          <Button
            w="full"
            rounded="full"
            _text={{fontWeight: 'bold'}}
            onPress={() => {
              SheetManager.hide('orderDetailsSheet');
              ordersStore.setSelectedOrder({});
              ordersStore.setSelectedOrderId(0);
            }}>
            Back home
          </Button>
        </Center>
      </Box>
    ),
    [],
  );

  const FullPin = useCallback(
    () => (
      <Box py={6} px={4} bg="#182819" h="full" roundedTop="2xl">
        <Center flex={1} alignItems="center" justifyContent="center">
          <Text
            style={styles.rotateText}
            fontSize="9xl"
            fontFamily="body"
            w={WIN_HEIGHT * 0.7}
            h={WIN_WIDTH * 0.8}
            textAlign="center"
            color="white"
            fontWeight="bold">
            #
            {ordersData?.status && ordersData?.status >= 3
              ? ordersData?.delivery_pin
              : ordersData?.pick_up_pin}
          </Text>
        </Center>
        <Center py={8}>
          <Pressable
            onPress={() => {
              setShowFullPin(false);
            }}>
            <Text color="#15AA56" fontWeight="bold">
              Go Back
            </Text>
          </Pressable>
        </Center>
      </Box>
    ),
    [ordersData?.delivery_pin, ordersData?.pick_up_pin, ordersData?.status],
  );

  const handleClosePress = () => {
    if (sheetRef.current) {
      sheetRef.current.close();
    }
  };

  const handleExpand = () => {
    if (sheetRef.current) {
      sheetRef.current.expand();
    }
  };

  useEffect(() => {
    if (sheetOpen && order_id) {
      setTimeout(() => {
        getOrderInfo();
      }, 1000);
    }
  }, [order_id, sheetOpen]);

  // useEffect(() => {
  //   if (sheetOpen) {
  //     handleExpand;
  //   } else {
  //     handleClosePress;
  //     bottomSheetStore.SetSheet('orderDetailsView', false);
  //   }
  // }, [sheetOpen]);

  useEffect(() => {
    if (sheetOpen) {
      handleExpand();
    } else {
      handleClosePress();
      bottomSheetStore.SetSheet('orderDetailsView', false);
    }
  }, [sheetOpen]);

  // if app returns from the background, we refetch order details
  useEffect(() => {
    if (isForeground && sheetOpen) {
      getOrderInfo();
    }
  }, [isForeground, sheetOpen]);

  return sheetOpen ? (
    <BottomSheet
      ref={sheetRef}
      index={1}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{backgroundColor: 'transparent'}}
      enableDynamicSizing={false}
      handleComponent={null}
      // enablePanDownToClose
      onChange={handleSheetChanges}>
      <BottomSheetView>
        {showFullPin ? (
          <FullPin />
        ) : orderCompleted ? (
          <OrderComplete />
        ) : hasViewDetails === 'full' ? (
          ContentFull()
        ) : (
          Content()
        )}
        <Toast config={toastConfig} />
      </BottomSheetView>
    </BottomSheet>
  ) : (
    <></>
  );
});

const styles = StyleSheet.create({
  rotateText: {
    transform: [{rotate: '-90deg'}],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
