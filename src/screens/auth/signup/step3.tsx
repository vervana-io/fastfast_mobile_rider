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

import {BackButton} from '@components/ui';
import {BikeIcon} from '@assets/svg/BikeIcon';
import {DefaultLayout} from '@layouts/default';
import {Formik} from 'formik';
import {ImageFillIcon} from '@assets/svg/ImageFillIcon';
import {Input} from '@components/inputs';
import {Platform} from 'react-native';
import {SignupTop} from './components/signupTop';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {VehicleIcon} from '@assets/svg/VehicleIcon';
import {launchImageLibrary} from 'react-native-image-picker';
import {navigate} from '@navigation/NavigationService';

interface SignUpStep3Type {
  route?: any;
}

export const SignUpStep3 = (props: SignUpStep3Type) => {
  const {route} = props;
  const [selectedVehicleType, setSelectedVehicleType] = useState<
    'bike' | 'car' | 'none'
  >('bike');

  const regData = route?.params?.data;

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

  return (
    <DefaultLayout>
      <Box flex={1} p={6}>
        <BackButton />
        <Formik
          initialValues={{
            vehicle_plate_number: '',
            vehicle_brand: '',
          }}
          validationSchema={step2Shema}
          onSubmit={values => {
            if (license === 'l') {
              setLicense('');
            } else {
              const upd = {...regData, ...values};
              navigate('SignUpStep4', {data: upd});
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
                bg="themeLight.accent"
                _text={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontFamily: 'body',
                }}>
                Next
              </Button>
            </>
          )}
        </Formik>
      </Box>
    </DefaultLayout>
  );
};
