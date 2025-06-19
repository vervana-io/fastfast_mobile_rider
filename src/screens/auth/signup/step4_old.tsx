import {
  Box,
  Button,
  Center,
  HStack,
  Link,
  Pressable,
  SearchIcon,
  Text,
  VStack,
} from 'native-base';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import React, {useEffect, useState} from 'react';

import {Alert} from 'react-native';
import {AuthLayout} from '@layouts/authLayout';
import {BackButton} from '@components/ui';
import {DefaultLayout} from '@layouts/default';
import {Input} from '@components/inputs';
import PermissionManager from '@handlers/permissionHandler';
import {SheetManager} from 'react-native-actions-sheet';
import {SignupTop} from './components/signupTop';
import Toast from 'react-native-toast-message';
import {apiType} from '@types/apiTypes';
import {authStore} from '@store/auth';
import {bankTypes} from '@types/bankTypes';
import {functions} from '@helpers/functions';
import {getApiLevel} from 'react-native-device-info';
import {navigate} from '@navigation/NavigationService';
import {showMessage} from 'react-native-flash-message';
import {useAuth} from '@hooks/useAuth';
import {useBanks} from '@hooks/useBanks';
import {useGeolocation} from '@hooks/useGeoLocation';

interface SignUpStep4Type {
  route?: any;
}

export const SignUpStep4 = (props: SignUpStep4Type) => {
  const {route} = props;

  const regData = route?.params.params ?? route?.params?.data;

  const [bankName, setBankName] = useState<Partial<bankTypes>>({});
  const [location, setLocation] = useState<GeoPosition | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [validatedName, setValidatedName] = useState<{
    account_number: string;
    account_name: string;
  }>({});

  const {register, registerWithSSO} = useAuth();
  const {validateBank} = useBanks();
  const {geoCode} = useGeolocation();

  const GeoLocate = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation(position);
      },
      error => {
        // Alert.alert(`Code ${error.code}`, error.message);
        setLocation(null);
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

  useEffect(() => {

  }, [regData]);

  const proceed = async () => {
    const deviceId = await getApiLevel();
    const payload = {
      latitude: location?.coords.latitude ?? '0',
      longitude: location?.coords.longitude ?? '0',
      bank_name: bankName.name,
      bank_code: bankName.code,
      account_number: validatedName.account_number,
      account_name: validatedName.account_name,
      device_version: deviceId.toString(),
    };
    const upd = {...regData.registerData, ...payload};
    if (regData.registerData.provider) {
      registerWithSSO.mutate(upd, {
        onSuccess: (val: apiType) => {
          if (val.status) {
            // Alert.alert('Registration Successful');
            navigate('Auth', {screen: 'Completion'});
            authStore.setRegisterData({
              registerData: {},
              step: undefined,
            });
          }
        },
        onError: (e: any) => {
          const errorS = e.data.errors;
          for (const key in errorS) {
            if (Object.prototype.hasOwnProperty.call(errorS, key)) {
              const el = errorS[key];
              Toast.show({
                type: 'error',
                text1: 'Create Account',
                text2: el,
              });
            }
          }
        },
      });
    } else {
      register.mutate(upd, {
        onSuccess: (val: apiType) => {
          if (val.status) {
            // Alert.alert('Registration Successful');
            navigate('Auth', {screen: 'Completion'});
            authStore.setRegisterData({
              registerData: {},
              step: undefined,
            });
          }
        },
        onError: (e: any) => {
          const errorS = e.data.errors;
          for (const key in errorS) {
            if (Object.prototype.hasOwnProperty.call(errorS, key)) {
              const el = errorS[key];
              Toast.show({
                type: 'error',
                text1: 'Create Account',
                text2: el,
              });
            }
          }
        },
      });
    }
    // geoCode.mutate(
    //   {
    //     lat: location?.coords.latitude ?? 0,
    //     lng: location?.coords.longitude ?? 0,
    //   },
    //   {
    //     onSuccess: val => {
    //       const res = val.results[0];
    //       const payload = {
    //         city: functions.filterGeoData(
    //           'administrative_area_level_2',
    //           res?.address_components,
    //         )?.long_name,
    //         state: functions.filterGeoData(
    //           'administrative_area_level_1',
    //           res?.address_components,
    //         )?.long_name,
    //         house_number:
    //           functions.filterGeoData('street_number', res?.address_components)
    //             ?.long_name ?? '0',
    //         street:
    //           functions.filterGeoData('route', res?.address_components)
    //             ?.long_name +
    //           ' - ' +
    //           functions.filterGeoData('neighborhood', res?.address_components)
    //             ?.long_name,
    //         nearest_bus_stop: functions.filterGeoData(
    //           'neighborhood',
    //           res?.address_components,
    //         )?.long_name,
    //         // latitude: val?.geometry.location.lat.toString() ?? '0',
    //         // longitude: val?.geometry.location.lng.toString() ?? '0',
    //         country: 'Nigeria',
    //         is_primary: 1,
    //       };
    //     },
    //   },
    // );
  };

  const openBank = async () => {
    const banks = await SheetManager.show('bankSheet');
    if (banks) {
      setBankName(banks);
    }
  };

  useEffect(() => {
    // GeoLocate();
  }, []);

  const doValidateBank = (number: string) => {
    validateBank.mutate(
      {
        account_number: number,
        bank_code: bankName.code?.toString() ?? '',
      },
      {
        onSuccess: (val: apiType) => {
          if (val.status) {
            const data: any = val.data;
            setValidatedName(data);
          } else {
            showMessage({
              type: 'warning',
              message: 'We could not validate your account',
            });
          }
        },
      },
    );
  };

  const getLocation = (res: boolean) => {
    if (res) {
      GeoLocate();
    }
  };

  const callValidate = (val: string) => {
    setAccountNumber(val);
    if (val !== '') {
      if (val.length > 9) {
        doValidateBank(val);
      }
    }
  };

  return (
    <AuthLayout>
      <Box flex={1} p={6}>
        <BackButton />
        <VStack my={8}>
          <SignupTop title="Banking Details" percentage="100" />
          <VStack space={1} my={6}>
            <Box w="full" mt={3}>
              <Pressable onPress={openBank}>
                <Box
                  borderWidth={1}
                  rounded="lg"
                  justifyContent="center"
                  px={4}
                  borderColor="themeLight.gray.3"
                  h="52px">
                  <HStack justifyContent="space-between">
                    <Text>
                      {bankName.id ? bankName.name : 'Choose your bank'}
                    </Text>
                    <SearchIcon color="themeLight.accent" size={5} />
                  </HStack>
                </Box>
              </Pressable>
            </Box>
            <Box w="full" mt={3}>
              <Input
                label="Account Number"
                placeholder=""
                keyboardType="number-pad"
                value={accountNumber}
                py={4}
                onChangeText={e => callValidate(e)}
                // onEndEditing={() => doValidateBank()}
                caption={validatedName.account_name}
              />
              {validateBank.isLoading && (
                <Box
                  bg="themeLight.primary.light1"
                  rounded="lg"
                  px={2}
                  position="absolute"
                  right={0}>
                  <Text>Validating...</Text>
                </Box>
              )}
              {validateBank.isError && !validateBank.isLoading && (
                <Link
                  isUnderlined={false}
                  bg="themeLight.primary.light1"
                  rounded="lg"
                  px={2}
                  position="absolute"
                  right={0}>
                  Try again
                </Link>
              )}
            </Box>
          </VStack>
        </VStack>
        <Button
          w="full"
          rounded="60px"
          py={4}
          mb={3}
          isDisabled={validatedName.account_name ? false : true}
          onPress={proceed}
          isLoading={register.isLoading || registerWithSSO.isLoading}
          isLoadingText="Processing..."
          bg="themeLight.accent"
          _text={{color: 'white', fontWeight: 'bold', fontFamily: 'body'}}>
          Create Account
        </Button>
      </Box>
    </AuthLayout>
  );
};
