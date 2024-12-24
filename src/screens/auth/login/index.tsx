import {Alert, Platform} from 'react-native';
import {
  Box,
  Button,
  Center,
  HStack,
  Heading,
  Image,
  Link,
  Text,
  VStack,
} from 'native-base';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import React, {useCallback, useState} from 'react';
import {object, ref, string} from 'yup';

import {DefaultLayout} from '@layouts/default';
import {Formik} from 'formik';
import {Input} from '@components/inputs';
import {Pattern} from '@assets/svg/Pattern';
import Toast from 'react-native-toast-message';
import {WIN_HEIGHT} from '../../../config';
import {apiType} from '@types/index';
import {authStore} from '@store/auth';
import messaging from '@react-native-firebase/messaging';
import {navigate} from '@navigation/NavigationService';
import {useAuth} from '@hooks/useAuth';

GoogleSignin.configure({
  webClientId:
    '494832879264-6ttd63bog8ojsnteapbdhqc7v21ssuri.apps.googleusercontent.com',
});

interface LoginProp {
  navigation?: any;
}

export const Login = (props: LoginProp) => {
  const {navigation} = props;

  const {login} = useAuth();

  const loginSchema = object({
    email: string().email().required('Email is required'),
    password: string().required('Password is required'),
  });

  const ButtonWithSSO = useCallback(
    () => (
      <>
        {/* <Text>Or Continue With</Text> */}
        <HStack space={6} my={4}>
          {/* <Button
            leftIcon={<FBIcon />}
            bg="white"
            borderWidth={1}
            borderColor="#F4F4F4"
            px={3}
            _text={{fontWeight: 'light', color: 'black', ml: 2}}
            rounded="lg">
            Facebook
          </Button> */}
          {/* <Button
            leftIcon={<GoogleIcon />}
            bg="white"
            borderWidth={1}
            borderColor="#F4F4F4"
            px={3}
            onPress={doGoogleSignIn}
            _pressed={{bg: 'themeLight.accent', _text: {color: 'white'}}}
            _text={{fontWeight: 'light', color: 'black', ml: 2}}
            rounded="lg">
            Google
          </Button> */}
        </HStack>
        <HStack space={2}>
          <Text>Don’t have an account?</Text>
          <Link
            isUnderlined={false}
            onPress={() => navigate('Auth', {screen: 'SignUpStep1'})}
            _text={{
              fontWeight: 'bold',
              fontFamily: 'body',
              color: 'themeLight.accent',
            }}>
            Sign Up
          </Link>
        </HStack>
      </>
    ),
    [],
  );

  const doLogin = async (values: any) => {
    const token = await messaging().getToken();
    const payload = {
      device_token: token,
      field: values.email,
      password: values.password,
    };
    login.mutate(payload, {
      onSuccess: (val: apiType) => {
        if (val.status) {
          navigation.replace('App');
        } else {
          // Alert.alert(val.message);
          Toast.show({
            type: 'error',
            text1: 'Login',
            text2: val.message,
          });
        }
      },
      onError: (e: any) => {
        console.log('res error', e);
        if (e.status === 401) {
          // Alert.alert('Invalid Credentials');
          Toast.show({
            type: 'error',
            text1: 'Login',
            text2: 'Invalid Credentials',
          });
        } else if (e.status === 422) {
          const errorS = e.data.errors;
          console.log('error', errorS);
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
        }
      },
    });
  };

  return (
    <DefaultLayout>
      <Box position="absolute" top={0} w="full" left={0} zIndex={1}>
        <Pattern />
      </Box>
      <Box alignItems="center" flex={1} pt={0.2 * WIN_HEIGHT}>
        <Box w={110} h={110}>
          <Image
            w="full"
            h="full"
            alt="rider logo"
            source={require('@assets/img/riderlogo.png')}
          />
        </Box>
        <Center mt={8} w="full" px={8}>
          <Heading size="md" fontWeight="bold">
            Login To Your Account
          </Heading>
          <Formik
            initialValues={{
              email: authStore.email ?? '',
              password: '',
            }}
            validationSchema={loginSchema}
            onSubmit={values => {
              doLogin(values);
            }}>
            {({
              handleChange,
              handleSubmit,
              handleBlur,
              touched,
              errors,
              values,
            }) => (
              <VStack w="full" space={2}>
                <Box w="full" mt={3}>
                  <Input
                    label="Email"
                    placeholder=""
                    py={Platform.OS === 'ios' ? 4 : 2}
                    autoCapitalize="none"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    errorMessage={errors.email}
                    hasError={errors.email && touched.email ? true : false}
                    value={values.email}
                    autoComplete="email"
                  />
                </Box>
                <Box w="full" mt={3}>
                  <Input
                    label="Password"
                    placeholder=""
                    isSecure
                    hasIcon
                    iconPosition="right"
                    onChangeText={handleChange('password')}
                    autoComplete="current-password"
                    onBlur={handleBlur('password')}
                    errorMessage={errors.password}
                    hasError={
                      errors.password && touched.password ? true : false
                    }
                    value={values.password}
                    py={Platform.OS === 'ios' ? 4 : 2}
                    onSubmitEditing={handleSubmit}
                  />
                </Box>
                <Link
                  _text={{fontSize: 14, fontWeight: 'medium'}}
                  onPress={() => navigation.navigate('ForgotStep1')}
                  isUnderlined={false}>
                  Forgot Your Password?
                </Link>
                <Center mt={4}>
                  <Button
                    w="full"
                    rounded="3xl"
                    py={4}
                    mb={3}
                    bg="themeLight.accent"
                    isLoading={login.isLoading}
                    isLoadingText="Logging in..."
                    onPress={() => handleSubmit()}
                    _text={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontFamily: 'body',
                    }}>
                    Login
                  </Button>
                  <ButtonWithSSO />
                </Center>
              </VStack>
            )}
          </Formik>
        </Center>
      </Box>
    </DefaultLayout>
  );
};
