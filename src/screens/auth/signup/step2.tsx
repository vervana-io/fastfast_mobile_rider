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

import {BackButton} from '@components/ui';
import {DefaultLayout} from '@layouts/default';
import {Input} from '@components/inputs';
import {SignupTop} from './components/signupTop';
import Toast from 'react-native-toast-message';
import {__passwords__} from '@helpers/regex/constants';
import {apiType} from '@types/apiTypes';
import {navigate} from '@navigation/NavigationService';
import {showMessage} from 'react-native-flash-message';
import {useAuth} from '@hooks/useAuth';

interface SignUpStep2Type {
  route?: any;
}

export const SignUpStep2 = (props: SignUpStep2Type) => {
  const {route} = props;

  const regData = route?.params?.data;

  const {sendToken, sendEmailToken, checkIfEmailExist} = useAuth();
  const [emailGood, setEmailGood] = useState<boolean>(false);

  const emref: any = useRef(null);

  const step2Shema = object({
    first_name: string().required('First name is required'),
    last_name: string().required('Last name is required'),
    phone_number: string().required('Your phone number is required'),
    email: string().email().required('Email is required'),
    password: string()
      .matches(
        __passwords__.M8L1D1S1.expression,
        'Password must contain Minimum eight characters, at least one letter, one number and one special character',
      )
      .required('Password is required'),
    confirm: string()
      .oneOf([ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const checkEmail = (email: string) => {
    if (email !== '') {
      checkIfEmailExist.mutate(
        {email},
        {
          onSuccess: (val: apiType) => {
            if (val.status) {
              setEmailGood(false);
              emref?.current?.setErrors({['email']: 'Email already exist'});
            } else if (!val.status) {
              setEmailGood(true);
              emref?.current?.setErrors({});
            } else {
              setEmailGood(false);
              emref?.current?.setErrors({
                ['email']: 'Could not validate email',
              });
            }
          },
        },
      );
    }
  };

  // const proceed = () => {
  //   if (username !== '' && username.length >= 6 && username.length <= 10) {
  //     if (isValidEmail(email)) {
  //       if (isValidPhoneNumber(phone)) {
  //         if (isValidPassword(password)) {
  //           if (password === confirm) {
  //             const old = JSON.parse(regData);
  //             const number = handlePhoneNumberChange(phone);
  //             const payload = {
  //               username,
  //               phone_number: number,
  //               email,
  //               first_name: firstname,
  //               last_name: lastname,
  //               password,
  //             };
  //             const upd = {...old, ...payload};
  //             const res = JSON.stringify(upd);
  //             sendToken.mutate(
  //               {phone_number: number},
  //               {
  //                 onSuccess: (val: apiType) => {
  //                   if (val.status) {
  //                     navigate('Validation', {data: res});
  //                   } else {
  //                     showMessage({
  //                       type: 'danger',
  //                       message: 'Could not send validation token',
  //                     });
  //                   }
  //                 },
  //               },
  //             );
  //           } else {
  //             Alert.alert('Passwords do not match');
  //           }
  //         } else {
  //           Alert.alert(
  //             'Password must match at least 1 Special character, a number, a capital letter and minimum of 6 digits',
  //           );
  //         }
  //       } else {
  //         Alert.alert('Please provide a valid phone number');
  //       }
  //     } else {
  //       Alert.alert('Please provide a valid email');
  //     }
  //   } else {
  //     Alert.alert(
  //       'Username must not be greater than 10 or less than 6 characters',
  //     );
  //   }
  // };

  return (
    <DefaultLayout>
      <Box flex={1} p={6}>
        <BackButton />
        <Formik
          initialValues={{
            first_name: '',
            last_name: '',
            phone_number: '',
            email: '',
            password: '',
            confirm: '',
          }}
          validationSchema={step2Shema}
          innerRef={emref}
          onSubmit={values => {
            const upd = {...regData, ...values};
            sendEmailToken.mutate(
              {
                email: upd.email,
              },
              {
                onSuccess: (val: apiType) => {
                  console.log('res', val);
                  if (val.status) {
                    const dpd = {
                      email: values.email,
                      data: upd,
                      redirectRule: {status: true, route: 'SignUpStep3'},
                    };
                    navigate('Validation', {
                      params: dpd,
                    });
                  } else {
                    console.log(val);
                    Toast.show({
                      type: 'error',
                      text1: 'Create Account',
                      text2: val.message,
                    });
                  }
                },
              },
            );
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
                      errorMessage={errors.phone_number}
                      hasError={
                        errors.phone_number && touched.phone_number
                          ? true
                          : false
                      }
                      value={values.phone_number}
                      // py={Platform.OS === 'ios' ? 4 : 2}
                      keyboardType="phone-pad"
                    />
                  </Box>
                  <Box w="full" mt={3}>
                    <Input
                      label="Email"
                      placeholder="Your email address"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      errorMessage={errors.email}
                      hasError={errors.email && touched.email ? true : false}
                      value={values.email}
                      // py={Platform.OS === 'ios' ? 4 : 2}
                      onEndEditing={() => checkEmail(values.email)}
                      keyboardType="email-address"
                    />
                    {checkIfEmailExist.isLoading && (
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
                  <Box w="full" mt={3}>
                    <Input
                      label="Password"
                      placeholder=""
                      isSecure
                      hasIcon
                      iconPosition="right"
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      errorMessage={errors.password}
                      hasError={
                        errors.password && touched.password ? true : false
                      }
                      value={values.password}
                      // py={Platform.OS === 'ios' ? 4 : 2}
                    />
                  </Box>
                  <Box w="full" mt={3}>
                    <Input
                      label="Confirm Password"
                      placeholder=""
                      isSecure
                      hasIcon
                      iconPosition="right"
                      onChangeText={handleChange('confirm')}
                      onBlur={handleBlur('confirm')}
                      errorMessage={errors.confirm}
                      hasError={
                        errors.confirm && touched.confirm ? true : false
                      }
                      value={values.confirm}
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
                isDisabled={!emailGood || sendEmailToken.isLoading}
                isLoading={sendEmailToken.isLoading}
                isLoadingText="Processing..."
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
