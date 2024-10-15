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
  CloseIcon,
  DeleteIcon,
  Divider,
  HStack,
  Image,
  Pressable,
  Text,
  VStack,
  useColorMode,
} from 'native-base';
import {Linking, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {WIN_HEIGHT, WIN_WIDTH} from '../../config';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {CameraScreen} from '../ui/camera';
import {ExpandIcon} from '@assets/svg/Expand';
import {PhoneIcon} from '@assets/svg/PhoneIcon';
import {QuestionIcon} from '@assets/svg/QuestionIcon';
import {apiType} from '@types/index';
import io from 'socket.io-client';
import {observer} from 'mobx-react-lite';
import {orderType} from '@types/orderTypes';
import {ordersStore} from '@store/orders';
import {uploadedOrderType} from '@types/generalType';
import {useIsFocused} from '@react-navigation/native';
import {useOrders} from '@hooks/useOrders';

export const OrderDetailsSheet = observer((props: SheetProps) => {
  const orderDetailsSheetRef = useRef<ActionSheetRef>(null);
  const [hasFullDetails, setFullDetails] = useState(false);
  const [uploadedOrder, setUploadedOrder] = useState<uploadedOrderType[]>([]);
  const allowedUpload = 2;
  const [errorMessage, setErrorMessage] = useState('');
  // const [ordersData, setOrdersData] = useState<Partial<orderType>>({});
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [showFullPin, setShowFullPin] = useState(false);

  const isFocused = useIsFocused();

  const {fetchSingleOrder, pickUpOrder, arrivalOrder, deliveredOrder} =
    useOrders();
  // const {singleOrder} = orderStates;

  const payload: any = props.payload;
  const order_id = payload?.order_id ?? ordersStore.selectedOrderId;
  const ordersData = ordersStore.selectedOrder;
  const request_id = payload?.request_id ?? ordersData?.misc_rider_info?.id;
  const socket: any = useRef<ReturnType<typeof io> | null>(null);

  const {colorMode} = useColorMode();

  const _snapPhoto = async () => {
    await launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        includeBase64: true,
        quality: 1,
      },
      (response: any) => {
        console.log('result', response);
      },
    );
  };

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
            const pay: uploadedOrderType = {
              uri: response?.assets[0].uri ?? '',
              base64:
                `data:image/jpeg;base64,${response?.assets[0].base64}` ?? '',
            };
            setUploadedOrder(prev => [...prev, pay]);
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
          } else {
            setErrorMessage(val.message);
          }
        },
      },
    );
  }, [order_id, request_id]);

  const doDelivered = useCallback(() => {
    setErrorMessage('');
    deliveredOrder.mutate(
      {
        order_id,
        request_id,
      },
      {
        onSuccess: (val: apiType) => {
          if (val.status) {
            getOrderInfo();
            const pay: any = {
              customer_id: ordersData.customer_id,
              delivery_fee: ordersData.delivery_fee,
            };
            SheetManager.show('rateCustomerSheet', {payload: pay});
            // SheetManager.hide('orderDetailsSheet');
          } else {
            setErrorMessage(val.message);
          }
        },
      },
    );
  }, [order_id, ordersData.customer_id, ordersData.delivery_fee, request_id]);

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
            socket.current = io(process.env.SERVICE_URL);

            socket.current.emit('createRoom', order_id, (response: any) => {
              if (response.success) {
                console.log('Room created:', response.message);
                // reject(response);
              } else {
                console.error('Failed to create room:', response.message);
                // reject(new Error(response.message));
              }
            });
          } else {
            setErrorMessage(val.message);
          }
        },
      },
    );
  }, [order_id, pickUpOrder, request_id, uploadedOrder]);

  const getOrderInfo = () => {
    fetchSingleOrder.mutate({id: order_id});
  };

  const callCustomer = useCallback(() => {
    if (ordersData.customer?.phone_number_one) {
      Linking.openURL(`tel:${ordersData.customer?.phone_number_one}`);
    }
  }, [ordersData.customer?.phone_number_one]);

  useEffect(() => {
    if (isFocused && order_id) {
      setTimeout(() => {
        getOrderInfo();
      }, 1000);
    }
  }, [isFocused, order_id]);

  const Content = useCallback(() => {
    return (
      <Box bg="themeLight.primary.base" roundedTop="2xl">
        <Pressable
          onPress={() => orderDetailsSheetRef.current?.snapToOffset(100)}>
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
                  {ordersData?.seller?.address}
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
              <Text color="white" fontWeight="bold">
                Fee: ₦{ordersData?.sub_total}
              </Text>
              <Text color="white" fontWeight="bold">
                Delivery Fee: ₦{ordersData?.delivery_fee}
              </Text>
              <VStack bg="white" rounded="lg" h="155px" my={4} p={4} space={2}>
                {ordersData.order_products &&
                  ordersData.order_products?.map((el, i) => (
                    <Text key={i} color="black">
                      {el.quantity}x {el.product?.title}
                    </Text>
                  ))}
              </VStack>
              {ordersData.status === 3 &&
              ordersData.is_rider_customer_arrived === 1 ? (
                <Button
                  _text={{fontWeight: 'bold'}}
                  rounded="full"
                  py={4}
                  isLoading={deliveredOrder.isLoading}
                  onPress={doDelivered}>
                  I have delivered
                </Button>
              ) : ordersData.status === 3 &&
                ordersData.is_rider_customer_arrived === 0 ? (
                <Button
                  _text={{fontWeight: 'bold'}}
                  rounded="full"
                  py={4}
                  onPress={doArrival}>
                  I have arrived
                </Button>
              ) : (
                <Button
                  _text={{fontWeight: 'bold'}}
                  rounded="full"
                  py={4}
                  onPress={() =>
                    orderDetailsSheetRef.current?.snapToOffset(100)
                  }>
                  Proceed
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }, [
    callCustomer,
    deliveredOrder.isLoading,
    doArrival,
    doDelivered,
    ordersData?.delivery_fee,
    ordersData.is_rider_customer_arrived,
    ordersData.order_products,
    ordersData?.seller?.address,
    ordersData?.seller?.trading_name,
    ordersData.status,
    ordersData?.sub_total,
  ]);

  const ContentFull = useCallback(
    () => (
      <Box py={6} px={4} bg="white" h="full" roundedTop="2xl">
        <Pressable
          onPress={() => orderDetailsSheetRef.current?.snapToOffset(50)}>
          <Box
            w={45}
            h={45}
            bg="themeLight.primary.base"
            opacity={0.1}
            rounded="lg"
          />
          <Pressable
            onPress={() => orderDetailsSheetRef.current?.snapToOffset(50)}
            position="absolute"
            zIndex={4}
            top={3}
            left={3}>
            <CloseIcon size={5} color="themeLight.primary.base" />
          </Pressable>
        </Pressable>
        <ScrollView
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
                {ordersData?.seller?.address}
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
              <VStack>
                <Text fontWeight="bold">Fee</Text>
                <Text color="themeLight.gray.2" fontWeight="light">
                  ₦{ordersData?.sub_total}
                </Text>
              </VStack>
              <Divider orientation="vertical" mx={2} />
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
                    fetchSingleOrder.isLoading ? 'Updating records' : ''
                  }
                  onPress={doPickUp}>
                  Proceed
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
              <Button
                _text={{fontWeight: 'bold'}}
                rounded="full"
                py={4}
                mt={3}
                isLoading={deliveredOrder.isLoading}
                onPress={doDelivered}>
                I have delivered
              </Button>
            ) : null}
          </VStack>
        </ScrollView>
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
      ordersData?.delivery_fee,
      ordersData?.delivery_pin,
      ordersData.is_rider_customer_arrived,
      ordersData.order_detail,
      ordersData.order_products,
      ordersData?.pick_up_pin,
      ordersData?.seller?.address,
      ordersData?.seller?.trading_name,
      ordersData.status,
      ordersData?.sub_total,
      pickUpOrder.isLoading,
      uploadedOrder,
    ],
  );

  const OrderComplete = useCallback(
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
        <Center flex={1}>
          <Text
            style={styles.rotateText}
            fontSize="170px"
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

  return (
    <ActionSheet
      id={props.sheetId}
      ref={orderDetailsSheetRef}
      indicatorStyle={{
        width: 0,
      }}
      onChange={(position, height) => {
        // Get the offset from bottom
        const offsetFromBottom = height - position;
        // console.log('reached top', offsetFromBottom);
        setTimeout(() => {
          if (offsetFromBottom > 600) {
            setFullDetails(true);
          } else {
            setFullDetails(false);
          }
        }, 500);
      }}
      backgroundInteractionEnabled={true}
      isModal={false}
      snapPoints={[25, 55, 100]}
      initialSnapIndex={1}
      gestureEnabled={true}
      containerStyle={{
        height: WIN_HEIGHT,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: 'transparent',
        // backgroundColor: colorMode === 'dark' ? '#111827' : '#fff',
      }}>
      {showFullPin ? (
        <FullPin />
      ) : orderCompleted ? (
        <OrderComplete />
      ) : hasFullDetails ? (
        ContentFull()
      ) : (
        Content()
      )}
    </ActionSheet>
  );
});

const styles = StyleSheet.create({
  rotateText: {
    transform: [{rotate: '-90deg'}],
  },
});
