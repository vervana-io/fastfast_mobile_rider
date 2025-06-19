import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  Box,
  Button,
  Center,
  HStack,
  Heading,
  Link,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import React, {useCallback, useState} from 'react';
import {Platform} from 'react-native';
import {object, string} from 'yup';

import {RiderLogo} from '@assets/svg/RiderLogo';
import {Input} from '@components/inputs';
import {SSOButtons} from '@components/ui/ssobuttons';
import {useAuth} from '@hooks/useAuth';
import {AuthLayout} from '@layouts/authLayout';
import {navigate} from '@navigation/NavigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {apiType} from '@types/index';
import {Formik} from 'formik';
import Toast from 'react-native-toast-message';
import {STORAGE_KEY} from '../../../constant';

GoogleSignin.configure({
  webClientId:
    '494832879264-6ttd63bog8ojsnteapbdhqc7v21ssuri.apps.googleusercontent.com',
});

interface LoginProp {
  navigation?: any;
}

export const Login = (props: LoginProp) => {
  const {navigation} = props;
  const [showLoading, setShowLoading] = useState(false);

  const {login} = useAuth();

  const loginSchema = object({
    email: string().email().required('Email is required'),
    password: string().required('Password is required'),
  });

  const ButtonWithSSO = useCallback(
    () => (
      <Box mt={4} w={'full'}>
        <SSOButtons
          navigation={navigation}
          showLoading={(e: boolean) => setShowLoading(e)}
          type="login"
        />
        <VStack my={3}>
          <Box w={'full'} borderWidth={1} borderColor={'#F4F4F4'} />
          <Center top={-13.8} position={'absolute'} w={'full'}>
            <Box bg="themeLight.primary.light2" px={2} py={1}>
              <Text>Or</Text>
            </Box>
          </Center>
        </VStack>
      </Box>
    ),
    [navigation],
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
          AsyncStorage.setItem(
            STORAGE_KEY.ACCESS_TOKEN,
            val?.data?.access_token?.token,
          );
          navigation.replace('App');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Login',
            text2: val.message,
          });
        }
      },
      onError: (e: any) => {
        if (e.status === 401) {
          // Alert.alert('Invalid Credentials');
          Toast.show({
            type: 'error',
            text1: 'Login',
            text2: 'Invalid Credentials',
          });
        } else if (e.status === 422) {
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
        }
      },
    });
  };

  return (
    <AuthLayout>
      <Box flex={1} pt={16} bg="themeLight.primary.light2">
        <Box px={8}>
          <RiderLogo />
        </Box>
        <Box mt={8} w="full" px={8}>
          <Heading size="xl" fontWeight="semibold">
            Sign in to your {'\n'}Account
          </Heading>
          <ButtonWithSSO />
          <Formik
            initialValues={{
              email: '',
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
              <VStack w="full" space={2} mt={4}>
                <Text color="textSecondary">
                  Enter your email and password to log in
                </Text>
                <Box w="full" mt={3}>
                  <Input
                    label=""
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
                    label=""
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
                  <Center>
                    <HStack space={2}>
                      <Text>Don’t have an account?</Text>
                      <Link
                        onPress={() =>
                          navigate('Auth', {screen: 'SignUpStep1'})
                        }
                        _text={{
                          fontWeight: 'bold',
                          fontFamily: 'body',
                          color: 'black',
                        }}>
                        Sign Up
                      </Link>
                    </HStack>
                  </Center>
                </Center>
              </VStack>
            )}
          </Formik>
        </Box>
      </Box>
      {showLoading && (
        <Center
          position="absolute"
          top={0}
          left={0}
          bottom={0}
          w="full"
          h="full"
          bg="rgba(0,0,0,.4)">
          <Center bg="white" w="80px" h="80px" rounded="lg">
            <Spinner />
          </Center>
        </Center>
      )}
    </AuthLayout>
  );
};
