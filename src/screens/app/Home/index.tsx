import {AnimatedRegion, enableLatestRenderer} from 'react-native-maps';
import {AppState, AppStateStatus, Platform, StyleSheet} from 'react-native';
import {
  Box,
  Button,
  Center,
  HStack,
  HamburgerIcon,
  Pressable,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import React, {useCallback, useEffect, useRef, useState} from 'react';

import {BicycleIcon} from '@assets/svg/BicycleIcon';
import {DefaultLayout} from '@layouts/default';
import MapView from '@components/ui/map/mapView';
import {OrderRequest} from './components/orderRequest';
import {PusherEvent} from '@pusher/pusher-websocket-react-native';
import {SheetManager} from 'react-native-actions-sheet';
import Toast from 'react-native-toast-message';
import {Todos} from './components/todos';
import {UsePusher} from '@hooks/usePusher';
import {addressesStore} from '@store/addresses';
import {apiType} from '@types/apiTypes';
import {authStore} from '@store/auth';
import io from 'socket.io-client';
import {markersType} from '@types/mapTypes';
import {myLocationNotification} from '@handlers/localNotifications';
import {observer} from 'mobx-react-lite';
import {ordersStore} from '@store/orders';
import {useOrders} from '@hooks/useOrders';
import {useUser} from '@hooks/useUser';

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

  const [ridersPosition, setRidersPosition] = useState({
    title: 'You',
    latitude: location?.coords.latitude ?? 0,
    longitude: location?.coords.longitude ?? 0,
  });

  const {subscribe} = UsePusher();

  const socket: any = useRef<ReturnType<typeof io> | null>(null);
  const intervalRef: any = useRef<NodeJS.Timeout | null>(null);

  const userD = authStore.auth;
  const selectedOrder = ordersStore.selectedOrder;
  const address = addressesStore.selectedAddress;

  const {toggleOnlineStatus, userDetails} = useUser({enableFetchAddress: true});
  const {fetchOngoingOrders} = useOrders();
  const ordersOngoingCount = ordersStore.ongoingOrderCount;

  const GeoLocate = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('position', position);

        setRidersPosition({
          title: 'You',
          latitude: position?.coords?.latitude,
          longitude: position?.coords?.longitude,
        });
        if (position?.coords?.latitude !== null) {
          SendToSocket(position?.coords.latitude, position?.coords.longitude);
        }
      },
      error => {
        // Alert.alert(`Code ${error.code}`, error.message);
        setLocation(null);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: true,
        forceLocationManager: true,
        showLocationDialog: true,
      },
    );
  };

  // emit rider information to customer service
  const SendToSocket = (latitude: number, longitude: number) => {
    socket.current?.emit('message', {
      riderId: userD?.user?.id.toString(),
      orderId: selectedOrder?.id ?? '',
      // message:location,
      message: {
        message: {
          coords: {
            accuracy: 600,
            altitude: 0,
            altitudeAccuracy: 0,
            heading: 0,
            latitude: latitude,
            longitude: longitude,
            speed: 0,
          },
          mocked: false,
          provider: 'fused',
          timestamp: 1727774592688,
        },
        sender: '0UhHCw1nwc7haMLAAAF3',
      },
    });
  };

  // set Rider status to Online
  const goOnline = useCallback(() => {
    if (address.street) {
      toggleOnlineStatus.mutate(
        {
          status: onlineStatus ? 0 : 1,
        },
        {
          onSuccess: (val: apiType) => {
            if (val.status) {
              myLocationNotification('Your app is sending Locations regularly');
              setOnlineStatus(!onlineStatus);
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
    } else {
      Toast.show({
        type: 'warning',
        text1: 'Going Online?',
        text2: 'You need to set your current address to go online',
      });
      setTimeout(() => {
        SheetManager.show('addressSheetNewIOS');
      }, 1000);
    }
  }, [address.street, onlineStatus, toggleOnlineStatus, userDetails]);

  // socket initialization
  useEffect(() => {
    console.log('user', userD);
    if (onlineStatus) {
      socket.current = io(process.env.SERVICE_URL);

      // Handle connection event
      socket.current.on('connect', () => {
        console.log('Socket.IO connected');
      });

      // Handle disconnection
      socket.current.on('disconnect', () => {
        console.log('Socket.IO disconnected');
      });
    }

    // Clean up WebSocket connection and interval on component unmount
    return () => {
      // subscription.remove();

      if (socket.current) {
        socket.current.disconnect();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onlineStatus, appState, location, userD]);

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
  }, []);

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
    if (ordersOngoingCount) {
      const intervalId = setInterval(() => {
        GeoLocate();
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [GeoLocate, ordersOngoingCount]);
  useEffect(() => {
    if (ordersOngoingCount && !selectedOrder.id) {
      // throw notification of order ongoing
      Toast.show({
        type: 'info',
        text1: 'Order Ongoing',
        text2: `You have ${ordersOngoingCount} orders ongoing, navigate to orders to view them`,
        autoHide: false,
        onPress: () => {
          console.log('====================================');
          console.log('clicked');
          console.log('====================================');
          navigation.navigate('Orders');
        },
      });
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
    };

    if (selectedOrder.address?.id) {
      const customers_geo_data: markersType = {
        id: selectedOrder.address.id.toString(),
        title: selectedOrder.address?.street ?? '',
        latitude: parseFloat(selectedOrder?.address?.latitude ?? ''),
        longitude: parseFloat(selectedOrder?.address?.longitude ?? ''),
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
    subscribe('FastFast', (data: PusherEvent) => {
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
        const dData = data.data;
        const parsed = JSON.parse(dData);
        ordersStore.setNotifiedOrder(parsed);
      }
      if (data.eventName === 'rider_cancel_order') {
      }
    });
  }, [subscribe, userDetails]);

  return (
    <DefaultLayout
      refreshable={false}
      useKeyboardScroll={false}
      checkPermissions
      hasPermissionSet={GeoLocate}>
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
            onPress={() => navigation.openDrawer()}
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
          {ordersStore.selectedOrderId ? (
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
          ) : null}
        </HStack>
        {userD.user?.complaince_status !== 1 ? <Todos /> : null}
        <OrderRequest />
        <Box h="full" w="full" zIndex={1}>
          <MapView markers={markers} />
        </Box>
        <OnlineSection />
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
