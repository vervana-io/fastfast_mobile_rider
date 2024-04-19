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
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
// import MapView, {
//   LatLng,
//   Marker,
//   PROVIDER_GOOGLE,
//   Region,
// } from 'react-native-maps';
import React, {useCallback, useEffect, useState} from 'react';
import {WIN_HEIGHT, WIN_WIDTH} from '../../../config';

import {BicycleIcon} from '@assets/svg/BicycleIcon';
import {DefaultLayout} from '@layouts/default';
import MapView from '@components/ui/map/mapView';
import {OrderRequest} from './components/orderRequest';
import {SheetManager} from 'react-native-actions-sheet';
import {StyleSheet} from 'react-native';
import Toast from 'react-native-toast-message';
import {Todos} from './components/todos';
import {apiType} from '@types/apiTypes';
import {authStore} from '@store/auth';
import {enableLatestRenderer} from 'react-native-maps';
import {markersType} from '@types/mapTypes';
import {observer} from 'mobx-react-lite';
import {ordersStore} from '@store/orders';
import {playEffectForNotifications} from '@handlers/playEffect';
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

  const userD = authStore.auth;
  const selectedOrder = ordersStore.selectedOrder;

  const {toggleOnlineStatus, userDetails} = useUser({enableFetchAddress: true});

  const GeoLocate = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation(position);
        // console.log(position);
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

  const goOnline = () => {
    toggleOnlineStatus.mutate(
      {
        status: onlineStatus ? 0 : 1,
      },
      {
        onSuccess: (val: apiType) => {
          if (val.status) {
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
  };

  const OnlineSection = useCallback(
    () => (
      <Center position="absolute" bottom={0} w="full" zIndex={1}>
        <Center
          borderWidth={2}
          borderColor={
            onlineStatus ? 'themeLight.primary.base' : 'rgba(0,0,0, .7)'
          }
          w={20}
          h={20}
          p={1}
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
        <Center
          w="full"
          p={5}
          bg={onlineStatus ? 'rgba(0, 150, 85, .7)' : 'rgba(0,0,0, .7)'}
          zIndex={1}>
          <Text color="white" fontWeight="bold" fontSize="lg">
            You're{' '}
            {toggleOnlineStatus.isLoading && onlineStatus
              ? 'going offiline'
              : toggleOnlineStatus.isLoading && !onlineStatus
              ? 'going online'
              : !toggleOnlineStatus.isLoading && onlineStatus
              ? 'Online'
              : 'Offline'}
          </Text>
        </Center>
      </Center>
    ),
    [onlineStatus, toggleOnlineStatus.isLoading],
  );

  // this triggers the location function to get location if permissions has been set in default layout
  const getLocation = (res: boolean) => {
    if (res) {
      GeoLocate();
    }
  };

  // we trigger the location on page load assuming location is already set from onset
  useEffect(() => {
    GeoLocate();
  }, []);

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

    const riders_geo_data: markersType = {
      title: 'You',
      latitude: location?.coords.latitude ?? 0,
      longitude: location?.coords.longitude ?? 0,
    };

    const customers_geo_data: markersType = {
      id: selectedOrder.address?.id.toString(),
      title: selectedOrder.address?.street ?? '',
      latitude: parseFloat(selectedOrder.address?.latitude ?? ''),
      longitude: parseFloat(selectedOrder.address?.longitude ?? ''),
    };
    const group = [riders_geo_data, sellers_geo_data];
    const group2 = [riders_geo_data, customers_geo_data];
    if (selectedOrder.id) {
      if (picked_up_at !== null) {
        setMarkers(group);
      } else {
        setMarkers(group2);
      }
    }
  }, [location?.coords.latitude, location?.coords.longitude, selectedOrder]);

  useEffect(() => {
    // set onloine status
    if (userD.rider) {
      setOnlineStatus(userD.rider?.status === 1 ? true : false);
    }
  }, [userD]);

  return (
    <DefaultLayout checkPermissions hasPermissionSet={getLocation}>
      <Box flex={1} bg="themeLight.gray.3" style={styles.container}>
        <HStack
          position="absolute"
          top={3}
          zIndex={4}
          justifyContent="space-between"
          w="full"
          px={4}>
          <Pressable onPress={() => navigation.openDrawer()} w="45px" h="44px">
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
            <Pressable
              bg="white"
              rounded="lg"
              onPress={() =>
                SheetManager.show('orderDetailsSheet', {
                  payload: {order_id: ordersStore.selectedOrderId},
                })
              }>
              <HStack space={3} flex={1} shadow="9" alignItems="center" px={3}>
                <BicycleIcon />
                <Text color="themeLight.gray.1" fontWeight="bold">
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
              </HStack>
            </Pressable>
          ) : null}
        </HStack>
        {/* <Todos /> */}
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
