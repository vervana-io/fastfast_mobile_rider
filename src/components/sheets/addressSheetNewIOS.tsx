import ActionSheet, {
  ActionSheetRef,
  ScrollView,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import {Alert, Modal, Platform, TouchableOpacity} from 'react-native';
import {Alerts, AlertsProps} from '@components/ui';
/* eslint-disable react-native/no-inline-styles */
import {
  Box,
  Center,
  HStack,
  Pressable,
  SearchIcon,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
  Place,
} from 'react-native-google-places-autocomplete';
// import {NativeViewGestureHandler, ScrollView} from 'react-native-gesture-handler';
import React, {useCallback, useEffect, useRef, useState} from 'react';

import {CloseIconSolid} from '@assets/svg/closeIconSolid';
import {LocationPin3} from '@assets/svg/LocationPin3';
import {LocationPin4} from '@assets/svg/LocationPin4';
import {WIN_HEIGHT} from '../../config';
import {addAddressType} from '@types/userTypes';
import {addressesStore} from '@store/addresses';
import {apiType} from '@types/apiTypes';
import {functions} from '@helpers/functions';
import {useGeolocation} from '@hooks/useGeoLocation';
import {useIsFocused} from '@react-navigation/native';
import {useUser} from '@hooks/useUser';

export const AddressSheetsNewIOS = (props: SheetProps) => {
  const addressSheetNewRef = useRef<ActionSheetRef>(null);
  const [predefinedAddress, setPredefinedAddress] = useState<Place[]>([]);

  const placesRef: any = useRef();

  const addresses = addressesStore.addresses;

  const isFocused = useIsFocused();

  const {addAddress, updateAddress, userDetails, fetchAddress} = useUser();

  const [errorMessage, setErrorMessage] = useState<{
    type: AlertsProps['status'];
    message: any;
  }>();

  const {location, geoCode} = useGeolocation({
    enableFetchLocation: true,
  });

  const createAddress = (addData: addAddressType) => {
    addAddress.mutate(addData, {
      onSuccess: (val: apiType) => {
        console.log('result', val);
        if (val.status) {
          fetchAddress.refetch();
          userDetails.refetch();
          SheetManager.hide('addressSheetNewIOS', {
            payload: true,
          });
        }
      },
      onError: (e: any) => {
        const errorS = e.data.detail.data.error;
        console.log('error', errorS);
        if (errorS) {
          for (const key in errorS) {
            if (Object.prototype.hasOwnProperty.call(errorS, key)) {
              const el = errorS[key];
            }
          }
        } else {
        }
      },
    });
  };

  const updateUserAddress = (addData: addAddressType) => {
    updateAddress.mutate(addData, {
      onSuccess: (val: apiType) => {
        console.log('result', val);
        if (val.status) {
          fetchAddress.refetch();
          userDetails.refetch();
          SheetManager.hide('addressSheetNewIOS', {
            payload: true,
          });
        }
      },
      onError: (e: any) => {
        const errorS = e.data.detail.data.error;
        console.log('error', errorS);
        if (errorS) {
          for (const key in errorS) {
            if (Object.prototype.hasOwnProperty.call(errorS, key)) {
              const el = errorS[key];
            }
          }
        } else {
        }
      },
    });
  };

  const chooseLocation = (details: GooglePlaceDetail | null | any) => {
    if (details.id) {
      const det: addAddressType = {
        house_number: details.house_number ?? '-',
        street: details.street ?? '-',
        nearest_bus_stop: details.nearest_bus_stop ?? '-',
        city: details.city ?? '-',
        state: details.state ?? '-',
        country: 'Nigeria',
        latitude: details.geometry.location.lat.toString(),
        longitude: details.geometry.location.lng.toString(),
        is_primary: 1,
        address_id: details.id,
      };
      console.log('to update', det);
      if (det.street) {
        updateUserAddress(det);
      } else {
        setErrorMessage({
          type: 'error',
          message:
            'The address you have entered does not supply enough information',
        });
      }
    } else {
      const payload = {
        city: functions.filterGeoData(
          'administrative_area_level_2',
          details?.address_components,
        )?.long_name,
        state: functions.filterGeoData(
          'administrative_area_level_1',
          details?.address_components,
        )?.long_name,
        house_number:
          functions.filterGeoData('street_number', details?.address_components)
            ?.long_name ?? '0',
        street:
          functions.filterGeoData('route', details?.address_components)
            ?.long_name +
          ' - ' +
          functions.filterGeoData('neighborhood', details?.address_components)
            ?.long_name,
        nearest_bus_stop: functions.filterGeoData(
          'neighborhood',
          details?.address_components,
        )?.long_name,
        latitude: details?.geometry.location.lat.toString() ?? '0',
        longitude: details?.geometry.location.lng.toString() ?? '0',
        country: 'Nigeria',
        is_primary: 1,
      };
      console.log('to add', payload);
      if (payload.street) {
        createAddress(payload);
      } else {
        setErrorMessage({
          type: 'error',
          message:
            'The address you have entered does not supply enough information',
        });
      }
    }
  };

  const getGeoCode = useCallback(
    async (lat: number, lng: number) => {
      geoCode.mutate(
        {
          lat,
          lng,
        },
        {
          onSuccess: val => {
            if (val) {
              const mainResult: GooglePlaceDetail = val.results[0];
              // console.log('result', JSON.stringify(mainResult));
              chooseLocation(mainResult);
            }
          },
        },
      );
    },
    [geoCode],
  );

  const getCurrentLocation = useCallback(() => {
    if (location) {
      // console.log('position', location);
      getGeoCode(location?.coords.latitude, location?.coords.longitude);
    }
  }, [getGeoCode, location]);

  const RenderUseLocationButton = useCallback(() => {
    // placesRef.current.focus();
    return (
      <TouchableOpacity onPress={getCurrentLocation}>
        <HStack px={3.5} alignItems="center" space={3}>
          {geoCode.isLoading ? <Spinner /> : <LocationPin4 width={12} />}
          <Text>Use current location</Text>
        </HStack>
      </TouchableOpacity>
    );
  }, [geoCode.isLoading, getCurrentLocation]);

  const CustomRenderRow = useCallback((rowData: GooglePlaceData) => {
    return (
      <HStack space={2}>
        <Box mt={1}>
          <LocationPin3 fill="#1B7A41" width={17} height={17} />
        </Box>
        <VStack>
          <Text fontWeight="bold" fontSize="sm">
            {rowData.description}
          </Text>
          <Text fontSize="xs" color="themeLight.gray.2">
            {rowData.description}
          </Text>
        </VStack>
      </HStack>
    );
  }, []);

  // focus on the input field if the sheet is visible
  useEffect(() => {
    const focusAutocomplete = () => {
      if (placesRef.current) {
        placesRef.current.focus();
      }
    };

    // Focus the autocomplete input when the component mounts
    if (isFocused) {
      setTimeout(() => {
        focusAutocomplete();
      }, 500);
    }
  }, [isFocused]);

  // set predefined places,
  // fetch users previous locations and dump here
  useEffect(() => {
    const list: any[] = [];
    addresses.map(el => {
      list.push({
        description: `${el.house_number}, ${el.street}`,
        geometry: {
          location: {
            lat: parseFloat(el.latitude),
            lng: parseFloat(el.longitude),
          },
        },
        id: el.id,
        city: el.city,
        state: el.state,
        street: el.street,
        house_number: el.house_number,
        country: el.country,
        nearest_bus_stop: el.nearest_bus_stop,
      });
    });

    setPredefinedAddress(list);
  }, [addresses]);

  return (
    <ActionSheet
      id={props.sheetId}
      ref={addressSheetNewRef}
      indicatorStyle={{
        width: 61.5,
        height: 0,
      }}
      containerStyle={{
        height: WIN_HEIGHT * 0.89,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        backgroundColor: '#fff',
      }}
      gestureEnabled={true}>
      <Box w="full" h="full">
        <Box p={4}>
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontWeight="bold" fontSize="md">
              Change Delivery Address
            </Text>
            <Pressable onPress={() => SheetManager.hide('addressSheetNewIOS')}>
              <CloseIconSolid fill="#757575" />
            </Pressable>
          </HStack>
          {errorMessage?.message && (
            <Alerts
              status={errorMessage.type}
              title={errorMessage.message}
              variant="outline"
            />
          )}
          <ScrollView
            contentContainerStyle={{marginTop: 20}}
            showsVerticalScrollIndicator={false}>
            <GooglePlacesAutocomplete
              placeholder="Search"
              ref={placesRef}
              onPress={(
                data: GooglePlaceData,
                details: GooglePlaceDetail | null = null,
              ) => {
                chooseLocation(details);
              }}
              query={{
                key: process.env.GOOGLE_API_KEY,
                language: 'en',
                components: 'country:ng',
              }}
              renderRow={rowData => CustomRenderRow(rowData)}
              renderLeftButton={() => (
                <Box position="absolute" top={1.5} left={3} zIndex={1}>
                  <SearchIcon size={22} />
                </Box>
              )}
              // renderRightButton={() => (
              //   <Pressable
              //     onPress={resetSearch}
              //     position="absolute"
              //     top={1.5}
              //     right={3}
              //     zIndex={1}>
              //     <CloseIconSolid fill="#757575" width={14} />
              //   </Pressable>
              // )}
              renderHeaderComponent={RenderUseLocationButton}
              enableHighAccuracyLocation={true}
              predefinedPlaces={predefinedAddress}
              // currentLocation={true}
              // predefinedPlacesAlwaysVisible={true}
              keepResultsAfterBlur={true}
              enablePoweredByContainer={false}
              isRowScrollable={true}
              fetchDetails={true}
              debounce={300}
              styles={{
                textInputContainer: {},
                textInput: {
                  height: 38,
                  color: '#000',
                  fontSize: 13,
                  paddingLeft: 38,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                  backgroundColor: '#F6F6F6',
                },
                description: {
                  color: 'black',
                },
                predefinedPlacesDescription: {
                  color: '#1faadb',
                },
              }}
              textInputProps={{
                // Additional props for the custom input
                placeholderTextColor: '#757575',
                underlineColorAndroid: 'transparent', // Hide the underline on Android
              }}
            />
          </ScrollView>
        </Box>
        {addAddress.isLoading && (
          <Center
            position="absolute"
            w="full"
            h="full"
            left={0}
            bottom={0}
            shadow={6}
            bg="rgba(0,0,0,.1)">
            <Center bg="white" rounded="md" w="80px" h="80px">
              <Spinner />
            </Center>
          </Center>
        )}
        {updateAddress.isLoading && (
          <Center
            position="absolute"
            w="full"
            h="full"
            left={0}
            bottom={0}
            shadow={6}
            bg="rgba(0,0,0,.1)">
            <Center bg="white" rounded="md" w="80px" h="80px">
              <Spinner />
            </Center>
          </Center>
        )}
      </Box>
    </ActionSheet>
  );
};
