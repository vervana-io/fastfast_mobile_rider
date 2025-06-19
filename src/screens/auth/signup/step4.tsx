import {
  Box,
  Button,
  Center,
  HStack,
  Image,
  Pressable,
  Text,
  VStack,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {object, string} from 'yup';

import {BikeIcon} from '@assets/svg/BikeIcon';
import {ImageFillIcon} from '@assets/svg/ImageFillIcon';
import {VehicleIcon} from '@assets/svg/VehicleIcon';
import {Input} from '@components/inputs';
import {BackButton} from '@components/ui';
import {useAuth} from '@hooks/useAuth';
import {AuthLayout} from '@layouts/authLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {authStore} from '@store/auth';
import {apiType} from '@types/apiTypes';
import {Formik} from 'formik';
import {Platform} from 'react-native';
import {getApiLevel} from 'react-native-device-info';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import {STORAGE_KEY} from '../../../constant';
import {SignupTop} from './components/signupTop';

interface SignUpStep4Type {
  route?: any;
  navigation?: any;
}

export const SignUpStep4 = (props: SignUpStep4Type) => {
  const {route, navigation} = props;

  const regData = route?.params.params;

  const {register, registerWithSSO} = useAuth();

  const [selectedVehicleType, setSelectedVehicleType] = useState<
    'bike' | 'car' | 'none'
  >('bike');

  const [license, setLicense] = useState('l');

  const pickImage = async () => {
    await launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
      },
      (response: any) => {
        if (response.assets) {
          const res = response?.assets[0].base64;
          setLicense(res);
        }
      },
    );
  };

  const step2Shema = object({
    vehicle_plate_number: string().required('Valid vehicle plate number'),
    vehicle_brand: string().required('Valid vehicle brand is required'),
  });

  useEffect(() => {
  }, [regData]);

  const proceed = async (values: any) => {
    const token = await messaging().getToken();
    const deviceId = await getApiLevel();
    const regD = regData.registerData ? regData.registerData : regData;
    const dpd = {
      ...regD,
      ...values,
      vehicle_type: selectedVehicleType === 'bike' ? 1 : 2,
      drivers_license_base64: 'data:image/png;base64,' + license,
      device_token: token,
      device_version: deviceId.toString(),
    };

    const upd = dpd;
    if (regData.registerData?.provider) {
      registerWithSSO.mutate(upd, {
        onSuccess: (val: apiType) => {
          if (val.status) {
            // Alert.alert('Registration Successful');
            AsyncStorage.setItem(
              STORAGE_KEY.ACCESS_TOKEN,
              val?.data?.access_token?.token,
            );
            navigation.navigate('Auth', {screen: 'Completion'});
            authStore.setRegisterData({
              registerData: {},
              step: undefined,
            });
          } else {
            Toast.show({
              type: 'error',
              text1: 'Rider Registration',
              text2: val.message,
            });
          }
        },
        onError: (e: any) => {
          const errorS = e.status;
          if (errorS === 401) {
            Toast.show({
              type: 'error',
              text1: 'Rider Registration',
              text2: e.response.message,
            });
          }
          //ideally, the http file should return exactly the complete error response.
          if (errorS === 413) {
            Toast.show({
              type: 'error',
              text1: 'Rider Registration',
              text2: 'Image size is too large',
            });
          }
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
            navigation.navigate('Auth', {screen: 'Completion'});
            authStore.setRegisterData({
              registerData: {},
              step: undefined,
            });
          } else {
            Toast.show({
              type: 'error',
              text1: 'Rider Registration',
              text2: val.message,
            });
          }
        },
        onError: (e: any) => {
          const errorS = e.status;
          //ideally, the http file should return exactly the complete error response.
          if (errorS === 413) {
            Toast.show({
              type: 'error',
              text1: 'Rider Registration',
              text2: 'Image size is too large',
            });
          }
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
  };

  return (
    <AuthLayout>
      <Box flex={1} p={6}>
        <BackButton />
        <Formik
          initialValues={{
            latitude: '0',
            longitude: '0',
            vehicle_plate_number: '',
            vehicle_brand: '',
          }}
          validationSchema={step2Shema}
          onSubmit={values => {
            if (license === 'l') {
              setLicense('');
            } else {
              proceed(values);
            }
          }}>
          {({
            handleChange,
            handleSubmit,
            handleBlur,
            touched,
            errors,
            values,
          }) => (
            <>
              <VStack my={8}>
                <SignupTop title="Verification" percentage="75" />
                <VStack space={1} mt={6}>
                  <Box w="full" h="159px" borderWidth={1} borderStyle="dashed">
                    <Pressable flex={1} onPress={() => pickImage()}>
                      <Center flex={1}>
                        {license !== 'l' && license !== '' ? (
                          <Image
                            w="100%"
                            h="100%"
                            source={{
                              uri: 'data:image/png;base64,' + license,
                            }}
                            alt="Licence image"
                            rounded="md"
                          />
                        ) : (
                          <>
                            <ImageFillIcon />
                            <Text fontWeight="bold">
                              Tap to upload driver’s license
                            </Text>
                            <Text>png or jpg format. 5MB max</Text>
                          </>
                        )}
                      </Center>
                    </Pressable>
                  </Box>
                  {license === '' && (
                    <Text fontSize="xs" color="red.500">
                      You must upload a drivers licence
                    </Text>
                  )}
                  <Box my={5}>
                    <Text color="themeLight.gray.2">Vehicle Type</Text>
                    {selectedVehicleType === 'none' && (
                      <Text fontSize="xs" color="red.500">
                        You must choose a vehicle type
                      </Text>
                    )}
                    <Center mt={4}>
                      <HStack space={5}>
                        <TouchableOpacity
                          onPress={() => setSelectedVehicleType('bike')}>
                          <Center
                            w="100px"
                            h="102px"
                            borderWidth={1}
                            borderColor={
                              selectedVehicleType === 'bike'
                                ? 'themeLight.accent'
                                : 'themeLight.gray.3'
                            }
                            rounded="lg">
                            <BikeIcon />
                          </Center>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setSelectedVehicleType('car')}>
                          <Center
                            w="100px"
                            h="102px"
                            borderWidth={1}
                            borderColor={
                              selectedVehicleType === 'car'
                                ? 'themeLight.accent'
                                : 'themeLight.gray.3'
                            }
                            rounded="lg">
                            <VehicleIcon />
                          </Center>
                        </TouchableOpacity>
                      </HStack>
                    </Center>
                  </Box>
                  <Box w="full" mt={3}>
                    <Input
                      label="Vehicle Brand"
                      placeholder="Brand of vehicle"
                      onChangeText={handleChange('vehicle_brand')}
                      onBlur={handleBlur('vehicle_brand')}
                      errorMessage={errors.vehicle_brand}
                      hasError={
                        errors.vehicle_brand && touched.vehicle_brand
                          ? true
                          : false
                      }
                      value={values.vehicle_brand}
                      py={Platform.OS === 'ios' ? 4 : 2}
                    />
                  </Box>
                  <Box w="full" mt={3}>
                    <Input
                      label="Plate Number"
                      placeholder="Vehicle plate number"
                      onChangeText={handleChange('vehicle_plate_number')}
                      caption="If your vehicle is a bicycle, then you can use bicycle has the text here, this would also be verified"
                      onBlur={handleBlur('vehicle_plate_number')}
                      errorMessage={errors.vehicle_plate_number}
                      hasError={
                        errors.vehicle_plate_number &&
                        touched.vehicle_plate_number
                          ? true
                          : false
                      }
                      value={values.vehicle_plate_number}
                      py={Platform.OS === 'ios' ? 4 : 2}
                    />
                  </Box>
                </VStack>
              </VStack>
              <Button
                w="full"
                rounded="60px"
                py={4}
                mb={3}
                onPress={() => handleSubmit()}
                isLoading={register.isLoading || registerWithSSO.isLoading}
                isLoadingText="Processing..."
                bg="themeLight.accent"
                _text={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontFamily: 'body',
                }}>
                Create Account
              </Button>
            </>
          )}
        </Formik>
      </Box>
    </AuthLayout>
  );
};
