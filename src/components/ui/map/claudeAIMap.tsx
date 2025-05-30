import {Box, Center, Image, Spinner, Text} from 'native-base';
import {Animated, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef} from 'react';

import {ordersStore} from '@store/orders';
import {markersType} from '@types/mapTypes';
import MapViewDirections from 'react-native-maps-directions';

interface RiderMapProps {
  destinationCoords?: markersType;
  location?: markersType;
  riderImage: any; // Your rider marker image
  onLocationUpdate?: (location: {latitude: number; longitude: number}) => void;
}

const RiderMap: React.FC<RiderMapProps> = ({
  destinationCoords,
  riderImage,
  onLocationUpdate,
  location,
}) => {
  const mapRef = useRef<MapView>(null);
  const markerAnimation = useRef(new Animated.Value(0)).current;
  const [currentLocation, setCurrentLocation] = React.useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [showRoute, setShowRoute] = React.useState(false);

  const selectedOrder = ordersStore.selectedOrder;

  // Get initial location
  useEffect(() => {
    (async () => {
      if (location) {
        const initialLocation = {
          latitude: location.latitude,
          longitude: location.longitude,
        };
        setCurrentLocation(initialLocation);
        if (onLocationUpdate) {
          onLocationUpdate(initialLocation);
        }
      }
    })();
  }, [location, onLocationUpdate]);

  // Start animation when destination is set
  useEffect(() => {
    if (destinationCoords && currentLocation) {
      // Fit map to show both points
      const coordinates = [currentLocation, destinationCoords];
      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
        animated: true,
      });

      // Show route line
      setShowRoute(true);

      // Animate marker
      Animated.timing(markerAnimation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }).start();
    }
  }, [destinationCoords, currentLocation, markerAnimation]);

  if (!currentLocation) {
    return <View style={{flex: 1}} />;
  }

  const showCustomersInitialsIfImageNull = () => {
    const customerImage = selectedOrder.customer?.avatar;
    if (customerImage) {
      return (
        <Image
          source={{
            uri: selectedOrder.customer?.avatar,
          }}
          alt="image"
          rounded="full"
          style={{width: 30, height: 30}}
        />
      );
    } else {
      const firstLetter = selectedOrder.customer?.first_name
        ?.charAt(0)
        .toUpperCase();
      const firstLetter2 = selectedOrder.customer?.last_name
        ?.charAt(0)
        .toUpperCase();
      return (
        <Center
          w="full"
          h="full"
          bg="themeLight.accent"
          shadow="6"
          rounded="full">
          <Text
            style={{
              color: '#fff',
              fontSize: 14,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {firstLetter} {firstLetter2}
          </Text>
        </Center>
      );
    }
  };

  return currentLocation.latitude === 0 ? (
    <Center flex={1}>
      <Spinner />
    </Center>
  ) : (
    <MapView
      ref={mapRef}
      provider="google"
      style={{flex: 1}}
      initialCamera={{
        altitude: 15000,
        center: {
          latitude: currentLocation?.latitude ?? currentLocation?.latitude,
          longitude: currentLocation?.longitude ?? currentLocation?.longitude,
        },
        heading: 0,
        pitch: 1,
        zoom: currentLocation ? 16 : 14,
      }}
      initialRegion={{
        ...currentLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}>
      {/* Rider Marker */}
      <Marker coordinate={currentLocation}>
        <Image
          alt="rider logo"
          source={riderImage}
          rounded="full"
          style={{width: 40, height: 40}}
        />
      </Marker>

      {/* Destination Marker */}
      {destinationCoords && (
        <Marker coordinate={destinationCoords}>
          {/* <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: 'red',
            }}
          /> */}
          <Box w="30px" h="30px" rounded="full" bg="white">
            {destinationCoords.userType === 'seller' ? (
              <Image
                source={{
                  uri: selectedOrder.seller?.business_logo,
                }}
                alt="image"
                rounded="full"
                style={{width: 30, height: 30}}
              />
            ) : (
              showCustomersInitialsIfImageNull()
            )}
          </Box>
        </Marker>
      )}

      {/* Route Line */}
      {showRoute && destinationCoords && (
        <MapViewDirections
          origin={currentLocation}
          destination={destinationCoords}
          apikey={'AIzaSyBkuuBvnpwGK0l-_5eiO429SErpwE5SxSA'}
          strokeWidth={3} // Customize the line width
          // lineDashPattern={[5, 5]}
          strokeColor="#1B7A41" // Customize the line color
        />
      )}
    </MapView>
  );
};

export default RiderMap;
