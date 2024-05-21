import ActionSheet, {
  ActionSheetRef,
  ScrollView,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import {Alert, TouchableOpacity} from 'react-native';
/* eslint-disable react-native/no-inline-styles */
import {
  Box,
  Center,
  HStack,
  Pressable,
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
import {WIN_HEIGHT, http} from '../../config';
import {addressesTypes, updateAddressesTypes} from '@types/addressTypes';

import {CloseIconSolid} from '@assets/svg/closeIconSolid';
import {LocationPin3} from '@assets/svg/LocationPin3';
import {LocationPin4} from '@assets/svg/LocationPin4';
import {SearchIcon} from '@assets/svg/SearchIcon';
import Toast from 'react-native-toast-message';
import {TrashIcon} from '@assets/svg/TrashIcon';
import {addressesStore} from '@store/addresses';
import {apiType} from '@types/apiTypes';
import {functions} from '@helpers/functions';
import {observer} from 'mobx-react-lite';
import {useGeolocation} from '@hooks/useGeoLocation';
import {useUser} from '@hooks/useUser';

export const AddressSheetsNew = observer((props: SheetProps) => {
  const addressSheetNewRef = useRef<ActionSheetRef>(null);
  const [predefinedAddress, setPredefinedAddress] = useState<Place[]>([]);

  const {addAddress, updateAddress, deleteAddress, fetchAddress} = useUser({
    enableFetchAddress: true,
  });

  const {location, geoCode} = useGeolocation({enableFetchLocation: true});

  const addresses = addressesStore.addresses;

  const placesRef: any = useRef();

  const createAddress = useCallback((payload: addressesTypes) => {
    addAddress.mutate(payload, {
      onSuccess: (val: apiType) => {
        console.log('result', val);
        if (val.status) {
          fetchAddress.refetch();
          SheetManager.hide('addressSheetNew', {
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
              Toast.show({
                type: 'error',
                text1: 'Error updating address',
                text2: el,
              });
            }
          }
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error updating address',
            text2: 'An error occurred, try again later',
          });
        }
      },
    });
  }, []);

  const updateUserAddress = useCallback((payload: addressesTypes) => {
    updateAddress.mutate(payload, {
      onSuccess: (val: apiType) => {
        console.log('result', val);
        if (val.status) {
          fetchAddress.refetch();
          SheetManager.hide('addressSheetNew', {
            payload: true,
          });
        }
      },
      onError: (e: any) => {
        const errorS = e.data.errors;
        console.log('error', errorS);
        if (errorS) {
          for (const key in errorS) {
            if (Object.prototype.hasOwnProperty.call(errorS, key)) {
              const el = errorS[key];
              Toast.show({
                type: 'error',
                text1: 'Error updating address',
                text2: el,
              });
            }
          }
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error updating address',
            text2: 'An error occurred, try again later',
          });
        }
      },
    });
  }, []);

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
      getGeoCode(location?.coords.latitude, location?.coords.longitude);
    }
  }, [getGeoCode, location]);

  useEffect(() => {
    const list: any[] = [];
    addresses &&
      addresses.map(
        (el: {
          house_number: any;
          street: any;
          latitude: string;
          longitude: string;
          id: any;
          city: any;
          state: any;
          country: any;
          nearest_bus_stop: any;
        }) => {
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
        },
      );

    setPredefinedAddress(list);
  }, [addresses]);

  useEffect(() => {
    const focusAutocomplete = () => {
      if (placesRef.current) {
        placesRef.current.focus();
      }
    };

    // Focus the autocomplete input when the component mounts
    setTimeout(() => {
      focusAutocomplete();
    }, 500);
  }, []);

  const resetSearch = () => {
    placesRef.current.setAddressText('');
  };

  const chooseLocation = useCallback(
    (details: GooglePlaceDetail | null | any) => {
      console.log('result', JSON.stringify(details));
      if (details.id) {
        const det: updateAddressesTypes = {
          house_number: details.house_number ?? '',
          street: details.street ?? '-',
          nearest_bus_stop: details.nearest_bus_stop ?? '-',
          city: details.city ?? '-',
          state: details.state ?? '-',
          country: details.country ?? '-',
          latitude: details.latitude,
          longitude: details.longitude,
          address_id: details.id,
          is_primary: 1,
        };
        updateUserAddress(det);
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
            functions.filterGeoData(
              'street_number',
              details?.address_components,
            )?.long_name ?? '0',
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
        createAddress(payload);
      }
    },
    [createAddress, updateUserAddress],
  );

  const doDelete = (id: string) => {
    deleteAddress.mutate(
      {id},
      {
        onSuccess: (val: apiType) => {
          if (val.status) {
            fetchAddress.refetch();
          }
        },
      },
    );
  };

  const CustomRenderRow = useCallback(
    (rowData: GooglePlaceData) => {
      return (
        <HStack space={2} justifyContent="space-between" w="full">
          <HStack>
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
          <Pressable
            bg="rgba(238, 75, 75, 0.2)"
            p={2}
            rounded="full"
            w="32px"
            h="32px"
            onPress={() => doDelete(rowData.id)}>
            {deleteAddress.isLoading &&
            deleteAddress.variables?.id === rowData.id ? (
              <Spinner color="themeLight.primary.error" />
            ) : (
              <TrashIcon />
            )}
          </Pressable>
        </HStack>
      );
    },
    [deleteAddress.isLoading, deleteAddress.variables?.id],
  );

  const RenderUseLocationButton = useCallback(() => {
    placesRef.current.focus();
    return (
      <TouchableOpacity onPress={getCurrentLocation}>
        <HStack px={3.5} alignItems="center" space={3}>
          {geoCode.isLoading ? <Spinner /> : <LocationPin4 width={12} />}
          <Text>Use current location</Text>
        </HStack>
      </TouchableOpacity>
    );
  }, [geoCode.isLoading, getCurrentLocation]);

  const Content = useCallback(
    () => (
      <Box h={WIN_HEIGHT} p={4}>
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontWeight="bold" fontSize="md">
            Change Active Location
          </Text>
          <Pressable onPress={() => SheetManager.hide('addressSheetNew')}>
            <CloseIconSolid fill="#757575" />
          </Pressable>
        </HStack>
        <Box flex={1} pt={8}>
          <ScrollView>
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
                  <SearchIcon width={18} />
                </Box>
              )}
              renderRightButton={() => (
                <Pressable
                  onPress={resetSearch}
                  position="absolute"
                  top={1.5}
                  right={3}
                  zIndex={1}>
                  <CloseIconSolid fill="#757575" width={14} />
                </Pressable>
              )}
              renderHeaderComponent={RenderUseLocationButton}
              enableHighAccuracyLocation={true}
              predefinedPlaces={predefinedAddress}
              // currentLocation={true}
              predefinedPlacesAlwaysVisible={true}
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
      </Box>
    ),
    [
      CustomRenderRow,
      RenderUseLocationButton,
      chooseLocation,
      predefinedAddress,
    ],
  );

  const Loader = useCallback(
    () => (
      <Center
        position="absolute"
        w="full"
        h="full"
        left={0}
        bg="rgba(0,0,0,.4)">
        <Center bg="white" rounded="md" w="80px" h="80px">
          <Spinner />
        </Center>
      </Center>
    ),
    [],
  );

  return (
    <ActionSheet
      id={props.sheetId}
      ref={addressSheetNewRef}
      indicatorStyle={{
        width: 61.5,
        height: 0,
      }}
      containerStyle={{
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        backgroundColor: '#fff',
      }}
      gestureEnabled={true}>
      {Content()}
      {addAddress.isLoading && <Loader />}
      {updateAddress.isLoading && <Loader />}
    </ActionSheet>
  );
});
