import {Alert, Platform} from 'react-native';
import {Box, Button, Text, VStack} from 'native-base';
import {Field, Formik} from 'formik';
import React, {useEffect, useRef, useState} from 'react';
import {
  isValidEmail,
  isValidPassword,
  isValidPhoneNumber,
  isValidUsername,
} from '@helpers/regex';
import {object, ref, string} from 'yup';

import {AuthLayout} from '@layouts/authLayout';
import {BackButton} from '@components/ui';
import {DefaultLayout} from '@layouts/default';
import {Input} from '@components/inputs';
import {SignupTop} from './components/signupTop';
import Toast from 'react-native-toast-message';
import {__passwords__} from '@helpers/regex/constants';
import {apiType} from '@types/apiTypes';
import {authStore} from '@store/auth';
import {navigate} from '@navigation/NavigationService';
import {observer} from 'mobx-react-lite';
import {registerStoreType} from '@types/authType';
import {useAuth} from '@hooks/useAuth';

interface SignUpStep2Type {
  route?: any;
}

export const SignUpStep3 = observer((props: SignUpStep2Type) => {
  const {route} = props;

  const regData = route?.params.data;

  const {checkIfPhoneExist} = useAuth();

  const emref: any = useRef(null);

  const step3Shema = object({
    first_name: string().required('First name is required'),
    last_name: string().required('Last name is required'),
    phone_number: string().required('Your phone number is required'),
  });
  useEffect(() => {
    console.log('================step 3====================');
    console.log(regData);
    console.log('====================================');
  }, [regData, regData?.registerData?.email]);

  return (
    <AuthLayout>
      <Box flex={1} p={6}>
        <BackButton />
        <Formik
          initialValues={{
            first_name: regData?.registerData?.first_name ?? '',
            last_name: regData?.registerData?.last_name ?? '',
            phone_number: '',
          }}
          validationSchema={step3Shema}
          innerRef={emref}
          onSubmit={values => {
            const upd = {...regData.registerData, ...values};
            const det: registerStoreType = {
              registerData: upd,
              step: 4,
            };
            authStore.setRegisterData(det);
            navigate('SignUpStep4', {params: det});
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
                <SignupTop title="Personal Details" percentage="50" />
                <Text my={6}>Please fill in your personal details</Text>
                <VStack space={1}>
                  {/* <Box w="full" mt={3}>
      <Input
        label="User Name"
        placeholder="Choose a username"
        value={username}
        py={Platform.OS === 'ios' ? 4 : 2}
        onChangeText={e => setUsername(e)}
      />
    </Box> */}
                  <Box w="full" mt={3}>
                    <Input
                      label="First Name"
                      placeholder="Your legal first name"
                      onChangeText={handleChange('first_name')}
                      onBlur={handleBlur('first_name')}
                      errorMessage={errors.first_name}
                      autoComplete="name"
                      hasError={
                        errors.first_name && touched.first_name ? true : false
                      }
                      value={values.first_name}
                      // py={Platform.OS === 'ios' ? 4 : 2}
                    />
                  </Box>
                  <Box w="full" mt={3}>
                    <Input
                      label="Last Name"
                      placeholder="Your legal last name"
                      onChangeText={handleChange('last_name')}
                      onBlur={handleBlur('last_name')}
                      autoComplete="family-name"
                      errorMessage={errors.last_name}
                      hasError={
                        errors.last_name && touched.last_name ? true : false
                      }
                      value={values.last_name}
                      // py={Platform.OS === 'ios' ? 4 : 2}
                    />
                  </Box>
                  <Box w="full" mt={3}>
                    <Input
                      label="Phone Number"
                      placeholder=""
                      onChangeText={handleChange('phone_number')}
                      onBlur={handleBlur('phone_number')}
                      autoComplete="tel"
                      errorMessage={errors.phone_number}
                      hasError={
                        errors.phone_number && touched.phone_number
                          ? true
                          : false
                      }
                      value={values.phone_number}
                      // onEndEditing={() => checkPhoneNumber(values.phone_number)}
                      keyboardType="phone-pad"
                    />
                    {checkIfPhoneExist.isLoading && (
                      <Box
                        bg="themeLight.primary.light1"
                        rounded="lg"
                        px={2}
                        position="absolute"
                        right={0}>
                        <Text>Validating...</Text>
                      </Box>
                    )}
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
    </AuthLayout>
  );
});
