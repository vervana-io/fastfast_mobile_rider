import {Box, Text, View} from 'native-base';
import RNMapView, {Circle, Marker} from 'react-native-maps';
import React, {useEffect, useRef, useState} from 'react';

import {MapTypes} from '@types/mapTypes';
import {StyleSheet} from 'react-native';
import mapStyle from './mapStyles.json';

export const Map = (props: MapTypes) => {
  const {markers} = props;
  const mapRef = useRef<RNMapView>(null);

  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.1, // Adjust this value to control the zoom level
    longitudeDelta: 0.1,
  });

  const you = markers && markers[0];

  //   useEffect(() => {
  //     // Calculate the new region that encompasses both pickup and destination
  //     if (markers && markers?.length > 0) {
  //       const you = markers[0];
  //       const des = markers[1];

  //       console.log('you', you);

  //         const newRegion = {
  //           latitude: (parseFloat(pic.latitude) + parseFloat(des.latitude)) / 2,
  //           longitude: (parseFloat(pic.longitude) + parseFloat(des.longitude)) / 2,
  //           latitudeDelta:
  //             Math.abs(parseFloat(pic.latitude) - parseFloat(des.latitude)) * 2,
  //           longitudeDelta:
  //             Math.abs(parseFloat(pic.longitude) - parseFloat(des.longitude)) * 2,
  //         };
  //         setRegion(newRegion);
  //     }
  //   }, [markers]);

  return (
    <RNMapView
      ref={mapRef}
      provider="google"
      region={region}
      initialCamera={{
        altitude: 15000,
        center: {
          latitude: 6.579326230625549,
          longitude: 3.349792349257616,
        },
        heading: 0,
        pitch: 1,
        zoom: 11,
      }}
      zoomEnabled={false}
      customMapStyle={mapStyle}
      loadingEnabled
      // loadingBackgroundColor="blue"
      style={StyleSheet.absoluteFillObject}
      rotateEnabled={false}>
      {!!you && (
        <>
          {/* <Marker
            anchor={{x: 0.5, y: 0.6}}
            coordinate={{
              latitude: you.latitude,
              longitude: you.longitude,
            }}
            title="You"
            flat
            // style={{
            //   ...(destination.heading !== -1 && {
            //     transform: [
            //       {
            //         rotate: `${destination.heading}deg`,
            //       },
            //     ],
            //   }),
            // }}
          >
            <View style={styles.dotContainer}>
              <View style={[styles.arrow]} />
              <View style={styles.dot} />
            </View>
          </Marker> */}
          {/* <Marker
            anchor={{x: 0.6, y: 0.2}}
            coordinate={{
              latitude: parseFloat(pickupLocation.latitude),
              longitude: parseFloat(pickupLocation.longitude),
            }}
            flat
            // style={{
            //   ...(pickupLocation.heading !== -1 && {
            //     transform: [
            //       {
            //         rotate: `${pickupLocation.heading}deg`,
            //       },
            //     ],
            //   }),
            // }}
          >
            <View style={styles.dotContainer}>
              <View style={[styles.arrow]} />
              <View style={styles.dot} />
            </View>
          </Marker> */}
          <Circle
              center={{
                latitude: parseFloat(destination.latitude),
                longitude: parseFloat(destination.longitude),
              }}
              radius={2000}
              // strokeWidth={3}
              strokeColor="#E5F9EE"
              fillColor="#E5F9EE"
            />
          {/* <MapViewDirections
              origin={{
                latitude: parseFloat(destination.latitude),
                longitude: parseFloat(destination.longitude),
              }}
              destination={{
                latitude: parseFloat(pickupLocation.latitude),
                longitude: parseFloat(pickupLocation.longitude),
              }}
              apikey={process.env.GOOGLE_API_KEY ?? ''}
              strokeWidth={3} // Customize the line width
              // lineDashPattern={[5, 5]}
              strokeColor="#1B7A41" // Customize the line color
            /> */}
        </>
      )}
    </RNMapView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    // position: 'absolute',
    // top: 0,
    // bottom: 0,
    // left: 0,
    // right: 0,
    // borderRadius: 50,
    // overflow: 'hidden',
  },
  dotContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    backgroundColor: '#499D6A',
    width: 24,
    height: 24,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 12,
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
    elevation: 4,
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#009655',
  },
});
