import {
  Box,
  Button,
  Center,
  HStack,
  HamburgerIcon,
  Pressable,
  Spinner,
  Text,
} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  AppState,
  AppStateStatus,
  Linking,
  Platform,
  StyleSheet,
} from 'react-native';
import Geoloc, {GeoPosition} from 'react-native-geolocation-service';
import {enableLatestRenderer} from 'react-native-maps';

import {BottomActions} from '@components/utils';
import {DefaultLayout} from '@layouts/default';
import BackgroundJob from 'react-native-background-actions';
// import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import PermissionManager from '@handlers/permissionHandler';
import {functions} from '@helpers/functions';
import {UsePusher} from '@hooks/usePusher';
import {PusherEvent} from '@pusher/pusher-websocket-react-native';
import Geolocation from '@react-native-community/geolocation';
import {addressesStore} from '@store/addresses';
import {authStore} from '@store/auth';
import {bottomSheetStore} from '@store/bottom-sheet';
import {apiType} from '@types/apiTypes';
import {SheetManager} from 'react-native-actions-sheet';
import Toast from 'react-native-toast-message';
import {OrderRequest} from './components/orderRequest';
import {Todos} from './components/todos';
// import io from 'socket.io-client';
import RiderMap from '@components/ui/map/claudeAIMap';
import {useAppState} from '@hooks/useAppState';
import {useOrders} from '@hooks/useOrders';
import useSocket from '@hooks/useSocket';
import {useUser} from '@hooks/useUser';
import {useDrawerStatus} from '@react-navigation/drawer';
import {useIsFocused} from '@react-navigation/native';
import {ordersStore} from '@store/orders';
import {rootConfig} from '@store/root';
import {markersType} from '@types/mapTypes';
import {observer} from 'mobx-react-lite';

enableLatestRenderer();

interface HomeProps {
  navigation?: any;
}

export const Home = observer((props: HomeProps) => {
  const {navigation} = props;
  const [location, setLocation] = useState<GeoPosition | null>(null);
  const [markers, setMarkers] = useState<markersType[]>([]);
  const [onlineStatus, setOnlineStatus] = useState(false);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );
  const [shouldCheckPerms, setShouldCheckPerms] = useState(false);

  const isFocussed = useIsFocused();

  const [ridersPosition, setRidersPosition] = useState({
    // title: 'You',
    latitude: location?.coords.latitude ?? 0,
    longitude: location?.coords.longitude ?? 0,
  });

  const {subscribe} = UsePusher();

  // we initialize the socket here
  // const {isConnected, emit} = useSocket2();
  const {
    isConnected,
    emitMessage,
    updateRiderLocation,
    checkUserIsInRoom,
    removeRoom,
    createRoom,
    disconnectSocket,
    reconnectSocket,
  } = useSocket({
    // url: __DEV__
    //   ? 'https://6f6a-105-113-68-192.ngrok-free.app'
    //   : process.env.SERVICE_URL ?? '',
    url: process.env.SERVICE_URL ?? '',
    isOnline: onlineStatus,
  });

  const userD = authStore.auth;
  const selectedOrder = ordersStore.selectedOrder;
  const address = addressesStore.selectedAddress;

  const {toggleOnlineStatus, userDetails} = useUser({
    enableFetchAddress: true,
    enableFetchUser: true,
  });
  const {fetchOngoingOrders} = useOrders();
  const ordersOngoingCount = ordersStore.ongoingOrderCount;
  const [subscriptionId, setSubscriptionId] = useState<number | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showRerender, setShowRerender] = useState(false);
  const drawerStatus = useDrawerStatus();

  const {isForeground} = useAppState();

  const NotificationOrder: any = ordersStore.notifiedOrder;

  // emit rider information to customer service
  const SendToSocket = useCallback(
    (position: GeoPosition['coords']) => {
      if (selectedOrder.id) {
        if (selectedOrder.picked_up_at !== null && selectedOrder.status !== 4) {
          emitMessage('message', {
            riderId: userD?.user?.id.toString(),
            orderId: selectedOrder.id.toString(),
            // message:location,
            message: position,
          });
        }
      }
    },
    [
      emitMessage,
      selectedOrder.id,
      selectedOrder.picked_up_at,
      selectedOrder.status,
      userD?.user?.id,
    ],
  );

  const GeoLocate = useCallback(() => {
    Geoloc.getCurrentPosition(
      position => {
        console.log('position', position);
        setRidersPosition({
          // title: 'You',
          latitude: position?.coords?.latitude,
          longitude: position?.coords?.longitude,
        });
      },
      error => {
        console.log('====================================');
        console.log(error.code);
        console.log('====================================');
        if (error.code === 3) {
          // GeoLocate();
          console.log('====================================');
          console.log('Retry: ' + retryCount);
          console.log('====================================');
          if (retryCount < 2) {
            setRetryCount(retryCount + 1);
          } else if (retryCount >= 3) {
            console.log('====================================');
            console.log('Got here: ' + retryCount);
            console.log('====================================');
            setShowRerender(true);
          }
          Toast.show({
            type: 'error',
            text1: 'Location',
            text2: 'Location services timeout, retrying...',
          });
        } else if (error.code === 1) {
          // Toast.show({
          //   type: 'error',
          //   text1: 'Location',
          //   text2:
          //     'Location services are disabled, you need to permit this app to use location services',
          //   autoHide: false,
          // });
        } else if (error.code === 2) {
          Toast.show({
            type: 'error',
            text1: 'Location',
            text2:
              'We are unable to get your current location, please close app and reopen again.',
            visibilityTime: 6000,
          });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
        distanceFilter: 0,
        // useSignificantChanges: true,
      },
    );
  }, [retryCount]);

  const updateOnlineStatus = useCallback(
    (status: number) => {
      toggleOnlineStatus.mutate(
        {
          status,
        },
        {
          onSuccess: (val: apiType) => {
            if (val.status) {
              setOnlineStatus(onlineStatus ? false : true);
              rootConfig.setIsOnline(onlineStatus ? false : true);
              userDetails.refetch();
            } else {
              Toast.show({
                type: 'error',
                text1: 'Online Status',
                text2: val.message,
              });
            }
          },
        },
      );
    },
    [onlineStatus, toggleOnlineStatus, userDetails],
  );

  // set Rider status to Online - depreciated
  const _goOnline = useCallback(async () => {
    // first we check if user is online, then they go offline
    if (!onlineStatus) {
      // first we check if the user has an address set
      if (address.latitude) {
        // next we compare the users set address and his current ma position
        const lat1 = parseInt(address.latitude, 10);
        const lon1 = parseInt(address.longitude ?? '', 10);
        const lat2 = ridersPosition.latitude;
        const lon2 = ridersPosition.longitude;
        const comparePositions = functions.areLocationsApproximatelySame(
          lat1,
          lon1,
          lat2,
          lon2,
        );
        if (comparePositions) {
          console.log('got to compare right');
          updateOnlineStatus(1);
        } else {
          const hasAddress = await SheetManager.show('addressSheetNewIOS');
          console.log('got to compare wrong');
          console.log('hasAddress', hasAddress);
          if (hasAddress) {
            updateOnlineStatus(1);
          }
        }
      } else {
        console.log('got to no address set');
        Toast.show({
          type: 'warning',
          text1: 'Going Online?',
          text2: 'You need to set your current address to go online',
        });
        const hasAddress = await SheetManager.show('addressSheetNewIOS');
        if (hasAddress) {
          updateOnlineStatus(1);
        }
      }
    } else {
      console.log('going offline');
      updateOnlineStatus(0);
    }
  }, [
    address.latitude,
    address.longitude,
    onlineStatus,
    ridersPosition.latitude,
    ridersPosition.longitude,
    updateOnlineStatus,
  ]);

  const goOnline = useCallback(() => {
    PermissionManager.checkPerms().then((r: string) => {
      if (r === 'granted') {
        if (onlineStatus) {
          updateOnlineStatus(0);
          disconnectSocket();
        } else {
          updateOnlineStatus(1);
          reconnectSocket();
        }
      }
    });
  }, [disconnectSocket, onlineStatus, reconnectSocket, updateOnlineStatus]);

  const OnlineSection = useCallback(
    () => (
      <Center position="absolute" bottom={0} w="full" zIndex={1}>
        <Center position="absolute" bottom={0} w="full">
          <Center
            position="relative"
            borderWidth={2}
            borderColor={
              onlineStatus ? 'themeLight.primary.base' : 'rgba(0,0,0, .7)'
            }
            w={20}
            h={20}
            p={1}
            top={-70}
            rounded="full"
            my={4}>
            <Button
              rounded="full"
              w="full"
              h="full"
              bg={onlineStatus ? 'rgba(0, 150, 85, .7)' : 'rgba(0,0,0, .7)'}
              onPress={goOnline}
              _pressed={{bg: 'themeLight.accent'}}
              _text={{fontWeight: 'bold', fontSize: 'lg'}}>
              {toggleOnlineStatus.isLoading ? <Spinner color="white" /> : 'Go'}
            </Button>
          </Center>
        </Center>
        <Center
          w="full"
          p={5}
          bg={onlineStatus ? 'rgba(0, 150, 85, .7)' : 'rgba(0,0,0, .7)'}
          zIndex={1}>
          <Text color="white" fontWeight="bold" fontSize="lg">
            You're{' '}
            {toggleOnlineStatus.isLoading && onlineStatus
              ? 'going offline'
              : toggleOnlineStatus.isLoading && !onlineStatus
              ? 'going online'
              : !toggleOnlineStatus.isLoading && onlineStatus
              ? 'Online'
              : 'Offline'}
          </Text>
        </Center>
      </Center>
    ),
    [goOnline, onlineStatus, toggleOnlineStatus.isLoading],
  );

  // we trigger the location on page load assuming location is already set from onset
  useEffect(() => {
    GeoLocate();
  }, [GeoLocate]);

  // check for ongoing orders and if there are any, keep sending rider location updates
  // also notify the rider that they have an ongoing order
  useEffect(() => {
    // fetch the orders
    fetchOngoingOrders.mutate({
      page: 1,
      per_page: 6,
      status: '1',
    });
  }, []);

  useEffect(() => {
    if (
      selectedOrder?.id &&
      selectedOrder?.picked_up_at !== null &&
      selectedOrder?.status !== 4
    ) {
      checkUserIsInRoom(selectedOrder.id, (val: boolean) => {
        if (!val) {
          // myLocationNotification('Your app is sending Locations regularly');
          createRoom(selectedOrder?.id ?? 0);
        }
      });
    } else {
      // here we just remove the room
      removeRoom(selectedOrder?.id ?? 0);
    }
  }, [
    checkUserIsInRoom,
    createRoom,
    removeRoom,
    selectedOrder?.id,
    selectedOrder?.picked_up_at,
    selectedOrder?.status,
  ]);

  useEffect(() => {
    if (ordersOngoingCount > 0 && !selectedOrder.id) {
      // throw notification of order ongoing
      // myLocationNotification(
      //   `You have ${ordersOngoingCount} orders ongoing, navigate to orders to view them`,
      // );
      Toast.show({
        type: 'info',
        text1: 'Order Ongoing',
        text2: `You have ${ordersOngoingCount} orders ongoing, navigate to orders to view them`,
        visibilityTime: 6000,
      });
      if (!selectedOrder.id) {
        navigation.navigate('Orders');
      }
    }
  }, [navigation, ordersOngoingCount, selectedOrder.id]);
  // End ongoing order checks

  useEffect(() => {
    // here we get the sellers address and the riders address if picked_up time is null
    // if picked_up time is not null then we get customers address and riders address

    const picked_up_at = selectedOrder.picked_up_at;
    const sellers_geo_data: markersType = {
      id: selectedOrder.id?.toString() ?? '',
      title: selectedOrder.seller?.trading_name.replaceAll('_', ' ') ?? '',
      latitude: parseFloat(selectedOrder.seller?.latitude ?? ''),
      longitude: parseFloat(selectedOrder.seller?.longitude ?? ''),
      userType: 'seller',
    };

    if (selectedOrder.address?.id) {
      const customers_geo_data: markersType = {
        id: selectedOrder.address.id.toString(),
        title: selectedOrder.address?.street ?? '',
        latitude: parseFloat(selectedOrder?.address?.latitude ?? ''),
        longitude: parseFloat(selectedOrder?.address?.longitude ?? ''),
        userType: 'customer',
      };
      const group = [ridersPosition, sellers_geo_data];
      const group2 = [ridersPosition, customers_geo_data];
      if (selectedOrder.id) {
        if (picked_up_at !== null) {
          setMarkers(group);
        } else {
          setMarkers(group2);
        }
      } else {
        setMarkers([]);
      }
    }
  }, [
    location?.coords.latitude,
    location?.coords.longitude,
    selectedOrder,
    ridersPosition,
  ]);

  useEffect(() => {
    // set online status
    if (userD.rider) {
      setOnlineStatus(userD.rider?.status === 1 ? true : false);
    }
  }, [userD]);

  useEffect(() => {
    // here we remove the markes on the map if the order has been cleared
    if (!selectedOrder.id) {
      setMarkers([]);
    }
    // SheetManager.show('rateCustomerSheet');
  }, [selectedOrder]);

  // pusher event setup
  useEffect(() => {
    subscribe(
      `private-orders.approved.${userD?.user?.id}`,
      (data: PusherEvent) => {
        const event = JSON.parse(data.data); // First parse
        const order = event.order;
        const orderData = JSON.parse(order.data);

        /*
        
          pusher event {
  "channelName": "private-orders.approved.327",
  "eventName": "App\\Events\\OrderApproved",
  "data": "{\"order\":{\"user_id\":327,\"order_id\":409,\"rider_id\":35,\"request_id\":672,\"title\":\"New Order\",\"body\":\"New Order #ORDER_1749054228915799 for Food Hub at RXHG+RHQ, Ada-George Road, Rumuafrikom, Port Harcourt 500102, Rivers, Nigeria\",\"data\":\"{\\\"notification_name\\\":\\\"order_request\\\",\\\"status\\\":1,\\\"address\\\":{\\\"house_number\\\":null,\\\"latitude\\\":\\\"4.8295796\\\",\\\"longitude\\\":\\\"6.9764937\\\",\\\"street\\\":\\\"Ada-George Road, Port Harcourt, Nigeria\\\",\\\"nearest_bus_stop\\\":null},\\\"customer_address\\\":{\\\"latitude\\\":4.8562203,\\\"longitude\\\":6.9711322,\\\"street\\\":\\\"NTA Road, Port Harcourt, Nigeria\\\",\\\"city\\\":null,\\\"house_number\\\":null},\\\"amount\\\":\\\"13711.0000\\\",\\\"sub_total\\\":\\\"11400.0000\\\",\\\"delivery_fee\\\":\\\"1000.0000\\\",\\\"order_id\\\":409,\\\"orders\\\":[{\\\"Quantity\\\":3,\\\"name\\\":\\\"Palmwine\\\"}],\\\"time\\\":\\\"10 minutes\\\",\\\"title\\\":\\\"Food Hub has an order\\\",\\\"trading_name\\\":\\\"Food Hub\\\"}\"}}",
  "userId": null
}
        
        */

        console.log('pusher event', orderData);
        if (data.eventName === 'user_compliance_approve') {
          userDetails.refetch();
          Toast.show({
            type: 'success',
            text1: 'Compliance Approval',
            text2:
              'Your compliance has been approved you can now go online to receive orders.',
            swipeable: true,
            visibilityTime: 6000,
          });
        }
        if (data.eventName === 'user_compliance_reject') {
          userDetails.refetch();
          Toast.show({
            type: 'error',
            text1: 'Compliance Approval',
            text2: 'Your compliance has been rejected',
            swipeable: true,
            visibilityTime: 6000,
          });
        }
        if (data.eventName === 'rider_new_order') {
          console.log('NEW ORDER CAME IN!', JSON.stringify(data, null, 2));
          const dData = data.data;
          const parsed = JSON.parse(dData);
          ordersStore.setNotifiedOrder(parsed);
        }
        if (data.eventName === 'rider_cancel_order') {
        }
        if (data.eventName === 'rider_order_pickup') {
          Toast.show({
            type: 'success',
            text1: 'Order Ready for Pickup',
            text2: 'Your order is ready for pickup',
            swipeable: true,
            visibilityTime: 6000,
          });
        }
      },
    );
  }, [subscribe, userDetails]);

  // open the order details sheet if we have a selected order
  useEffect(() => {
    if (drawerStatus === 'closed') {
      const isOrderDetailsOpen =
        bottomSheetStore.checkIfSheetIsOpen('orderDetailsView');
      if (!isOrderDetailsOpen && selectedOrder.id) {
        bottomSheetStore.SetSheet('orderDetailsView', true);
      }
    }
  }, [selectedOrder.id]);

  /**
   * Here we are going to handle background location updates
   */
  const watchBackgroundUpdates = useCallback(() => {
    try {
      const watchID = Geolocation.watchPosition(
        position => {
          console.log('watchPosition', JSON.stringify(position));
          updateRiderLocation(userD.user?.id.toString() ?? '', position.coords);
          // here we check if the user has selected an order and the order is picked up already
          if (selectedOrder?.id) {
            if (
              selectedOrder.picked_up_at !== null &&
              selectedOrder.status !== 4
            ) {
              const intervalId = setInterval(() => {
                SendToSocket(position.coords);
                setRidersPosition({
                  // title: 'You',
                  latitude: position?.coords?.latitude,
                  longitude: position?.coords?.longitude,
                });
              }, 5000);
              return () => clearInterval(intervalId);
            }
          }
        },
        error => {
          console.log('====================================');
          console.log(error.code);
          console.log('====================================');
          if (error.code === 3) {
            // GeoLocate();
            console.log('====================================');
            console.log('Retry: ' + retryCount);
            console.log('====================================');
            if (retryCount < 2) {
              setRetryCount(retryCount + 1);
            } else if (retryCount >= 3) {
              console.log('====================================');
              console.log('Got here: ' + retryCount);
              console.log('====================================');
              setShowRerender(true);
            }
            Toast.show({
              type: 'error',
              text1: 'Location',
              text2: 'Location services timeout, retrying...',
            });
          } else if (error.code === 1) {
            Toast.show({
              type: 'error',
              text1: 'Location',
              text2:
                'Location services are disabled, you need to permit this app to use location services',
              autoHide: false,
            });
          } else if (error.code === 2) {
            Toast.show({
              type: 'error',
              text1: 'Location',
              text2:
                'We are unable to get your current location, please close app and reopen again.',
              visibilityTime: 6000,
            });
          }
        },
        // {
        //   enableHighAccuracy: true,
        //   distanceFilter: 1,
        //   useSignificantChanges: true,
        // },
      );
      setSubscriptionId(watchID);
    } catch (error) {
      Alert.alert('WatchPosition Error', JSON.stringify(error));
    }
  }, [
    SendToSocket,
    retryCount,
    selectedOrder?.id,
    selectedOrder.picked_up_at,
    selectedOrder.status,
    updateRiderLocation,
    userD.user?.id,
  ]);

  const clearWatch = () => {
    subscriptionId !== null && Geolocation.clearWatch(subscriptionId);
    setSubscriptionId(null);
    // setPosition(null);
  };

  const sleep = (time: any) =>
    new Promise<void>(resolve => setTimeout(() => resolve(), time));

  BackgroundJob.on('expiration', () => {
    console.log('iOS: I am being closed!');
  });

  const taskRandom = async (taskData: any) => {
    if (Platform.OS === 'ios') {
      console.warn(
        'This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,',
        'geolocalization, etc. to keep your app alive in the background while you excute the JS from this library.',
      );
      watchBackgroundUpdates();
    }
    await new Promise(async resolve => {
      // For loop with a delay
      const {delay} = taskData;
      console.log(BackgroundJob.isRunning(), delay);
      watchBackgroundUpdates();
      for (let i = 0; BackgroundJob.isRunning(); i++) {
        // console.log('Runned -> ', i);
        // watchBackgroundUpdates();
        // await BackgroundJob.updateNotification({taskDesc: 'Runned -> ' + i});
        await sleep(delay);
      }
    });
  };

  const options = {
    taskName: 'Location Update',
    taskTitle: 'FastFast Rider',
    taskDesc: 'Your current location is being updated',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'exampleScheme://home',
    parameters: {
      delay: 1000,
    },
  };

  function handleOpenURL(evt: any) {
    console.log(evt.url);
    // do something with the url
  }

  Linking.addEventListener('url', handleOpenURL);

  // start updating background locations
  useEffect(() => {
    const bgUpdates = async () => {
      if (onlineStatus) {
        await BackgroundJob.start(taskRandom, options);
      } else {
        await BackgroundJob.stop();
        clearWatch();
      }
    };
    bgUpdates();
  }, [onlineStatus]);

  const cleanUp = useCallback(async () => {
    if (!rootConfig.isOnline) {
      setOnlineStatus(false);
      disconnectSocket();
      await BackgroundJob.stop();
      clearWatch();
    }
  }, [disconnectSocket]);

  // clean-up
  useEffect(() => {
    cleanUp();
  }, [cleanUp]);

  // on focus, get users current location
  useEffect(() => {
    if (isForeground) {
      GeoLocate();
    }
  }, [GeoLocate, isForeground]);

  useEffect(() => {
    if (isFocussed && isForeground) {
      userDetails.refetch();
    }
  }, [isFocussed, isForeground]);

  return (
    <DefaultLayout
      refreshable={false}
      checkPermissions
      statusBarColor={onlineStatus ? '#009655' : 'white'}
      useKeyboardScroll={false}>
      <Box flex={1} bg="themeLight.gray.3" style={styles.container}>
        <HStack
          position="absolute"
          top={3}
          zIndex={4}
          justifyContent="space-between"
          w="full"
          px={4}>
          <Pressable
            mt={Platform.OS === 'ios' ? '8' : 0}
            onPress={() => {
              navigation.openDrawer();
            }}
            w="45px"
            h="44px">
            <Center
              rounded="2xl"
              opacity={0.1}
              bg="themeLight.accent"
              w="100%"
              h="100%"
            />
            <Center
              position="absolute"
              top={0}
              left={0}
              w="100%"
              h="100%"
              rounded="2xl"
              zIndex={1}>
              <HamburgerIcon color="themeLight.primary.base" size={6} />
            </Center>
          </Pressable>
          {/* {ordersStore.selectedOrderId ? (
            <Box safeArea>
              <Pressable
                bg="white"
                py={2}
                rounded="lg"
                onPress={() =>
                  SheetManager.show('orderDetailsSheet', {
                    payload: {order_id: ordersStore?.selectedOrderId},
                  })
                }>
                <HStack
                  space={3}
                  flex={1}
                  shadow="9"
                  alignItems="center"
                  px={3}>
                  <BicycleIcon />
                  <VStack>
                    <Text color="themeLight.gray.1" fontWeight="bold">
                      Click to reveal order
                    </Text>
                    <Text
                      fontSize="xs"
                      color="themeLight.gray.1"
                      fontWeight="light">
                      Heading to{' '}
                      {ordersStore.selectedOrder.status &&
                      ordersStore.selectedOrder.status < 3
                        ? 'restaurant'
                        : ordersStore.selectedOrder.status === 3
                        ? 'customer'
                        : ordersStore.selectedOrder.status === 4
                        ? 'Delivered'
                        : null}
                    </Text>
                  </VStack>
                </HStack>
              </Pressable>
            </Box>
          ) : null} */}
        </HStack>
        {userD.user?.complaince_status !== 1 ? <Todos /> : null}
        <OrderRequest />
        <Box h="full" w="full" zIndex={1}>
          {/* <MapView markers={markers} /> */}
          <RiderMap
            riderImage={require('@assets/img/marker.png')}
            destinationCoords={markers[1]}
            location={ridersPosition}
            onLocationUpdate={loc => console.log(loc)}
          />
          {/* <AppMapView /> */}
        </Box>
        <OnlineSection />
        <BottomActions show={showRerender} navigation={navigation} />
      </Box>
    </DefaultLayout>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
