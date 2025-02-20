import React, {useEffect, useRef, useState} from 'react';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {Animated, Easing, View} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const RiderMap = ({destination}) => {
  const [riderLocation, setRiderLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fetch current location
    Geolocation.getCurrentPosition(
      position => setRiderLocation(position.coords),
      error => console.error(error),
      {enableHighAccuracy: true},
    );
  }, []);

  const startMoving = () => {
    // Fetch route coordinates between riderLocation and destination
    getRouteCoordinates(riderLocation, destination).then(coords => {
      setRouteCoordinates(coords);
      animateMarker();
    });
  };

  const animateMarker = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const animatedCoords = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [riderLocation, routeCoordinates[routeCoordinates.length - 1]],
  });

  return null;
  return (
    <MapView style={{flex: 1}} region={}>
      {riderLocation && (
        <Marker
          coordinate={animatedCoords}
          image={require('./path/to/custom_marker.png')}
        />
      )}
      <Polyline
        coordinates={routeCoordinates}
        strokeWidth={5}
        strokeColor="blue"
      />
      <Button title="Move" onPress={startMoving} />
    </MapView>
  );
};

export default RiderMap;
