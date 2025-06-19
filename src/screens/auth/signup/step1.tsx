import {
  Box,
  Button,
  Center,
  Checkbox,
  HStack,
  Heading,
  Link,
  Pressable,
  Text,
  VStack,
} from 'native-base';
import {Linking, Modal} from 'react-native';
import React, {useCallback, useEffect, useRef, useState, useMemo} from 'react';
import {object, ref, string} from 'yup';

import {AuthLayout} from '@layouts/authLayout';
import {Calendar} from '@assets/svg/Calendar';
import {Formik} from 'formik';
import {Input} from '@components/inputs';
import {PackageIcon} from '@assets/svg/PackageIcon';
import {RiderLogo} from '@assets/svg/RiderLogo';
import {SSOButtons} from '@components/ui/ssobuttons';
import {SignupTop} from './components/signupTop';
import {TimeIcon} from '@assets/svg/TimeIcon';
import Toast from 'react-native-toast-message';
import {__passwords__} from '@helpers/regex/constants';
import {apiType} from '@types/apiTypes';
import {authStore} from '@store/auth';
import {navigate} from '@navigation/NavigationService';
import {observer} from 'mobx-react-lite';
import {registerStoreType} from '@types/authType';
import {useAuth} from '@hooks/useAuth';

const step1Schema = object({
  email: string().email().required('Email is required'),
  password: string()
    .matches(
      __passwords__.M8L1.expression,
      'Minimum eight characters, at least one letter',
    )
    .required('Password is required'),
  confirm: string()
    .oneOf([ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

const initialValues = {
  email: '',
  password: '',
  confirm: '',
};

export const SignUpStep1 = observer(props => {
  const {route, navigation} = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [emailGood, setEmailGood] = useState(false);
  const [terms, setTerms] = useState(false);

  const emref = useRef(null);

  const {sendEmailToken, checkIfEmailExist} = useAuth();

  // Memoized external browser opener
  const openBrowser = useCallback((url: string) => {
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }, []);

  // Memoized email checker
  const checkEmail = useCallback(
    (email: string) => {
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
    },
    [checkIfEmailExist],
  );

  // Memoized previous session handler
  const proceedPreviousSession = useCallback(() => {
    setModalVisible(false);
    const step = authStore.registerData.step;
    const registerData = authStore.registerData.registerData;
    if (step === 2) {
      navigate('SignUpStep2', {params: registerData});
    } else if (step === 5) {
      navigate('Validation', {params: registerData});
    } else if (step === 3) {
      navigate('SignUpStep3', {params: registerData});
    } else if (step === 4) {
      if (authStore.registerData.registerData?.provider) {
        authStore.setRegisterData({
          registerData: {},
          step: undefined,
        });
        setModalVisible(false);
        Toast.show({
          type: 'error',
          text1: 'Previous Session Expired',
          text2: 'Your session has expired',
        });
      } else {
        navigate('SignUpStep4', {params: registerData});
      }
    }
  }, []);

  // Memoized clear session handler
  const clearPreviousSession = useCallback(() => {
    authStore.setRegisterData({
      registerData: {},
      step: undefined,
    });
    setModalVisible(false);
  }, []);

  // On mount, check for previous session
  useEffect(() => {
    if (authStore.registerData?.step) {
      if (authStore.registerData.method !== 'provider') {
        setTimeout(() => {
          setModalVisible(true);
        }, 500);
      } else {
        const upd = authStore.registerData.registerData;
        const det: registerStoreType = {
          registerData: upd,
          step: authStore.registerData.step,
          method: 'none',
        };
        authStore.setRegisterData(det);
      }
    }
  }, []);

  // Memoized SSO Button
  const ButtonWithSSO = useMemo(
    () => (
      <Box mt={4} w={'full'}>
        <VStack mb={6}>
          <Box w={'full'} borderWidth={1} borderColor={'#D7D8DD'} />
          <Center top={-13.8} position={'absolute'} w={'full'}>
            <Box bg="themeLight.primary.light2" px={2} py={1}>
              <Text>Or</Text>
            </Box>
          </Center>
        </VStack>
        <SSOButtons
          navigation={navigation}
          showLoading={(e: boolean) => {}} // No-op for performance
          type="signup"
        />
      </Box>
    ),
    [navigation],
  );

  return (
    <AuthLayout>
      <Box flex={1} pt={16}>
        <Pressable onPress={navigation.goBack} px={8}>
          <RiderLogo />
        </Pressable>
        <VStack mt={8} px={8}>
          <Heading size="xl" fontWeight="semibold">
            Sign up for an {'\n'}Account
          </Heading>
          <Formik
            initialValues={initialValues}
            validationSchema={step1Schema}
            innerRef={emref}
            validateOnChange={false}
            validateOnBlur={true}
            onSubmit={values => {
              const det: registerStoreType = {
                registerData: values,
                step: 2,
              };
              authStore.setRegisterData(det);
              sendEmailToken.mutate(
                {email: values.email},
                {
                  onSuccess: (val: apiType) => {
                    if (val.status) {
                      const dpd = {
                        email: values.email,
                        data: det,
                        redirectRule: {status: true, route: 'SignUpStep2'},
                      };
                      navigate('Validation', {params: dpd});
                    } else {
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
                <VStack my={4}>
                  <Text color="textSecondary">
                    Enter your email and password to sign up
                  </Text>
                  <VStack space={1}>
                    <Box w="full" mt={3}>
                      <Input
                        label="Email"
                        placeholder="Your email address"
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        autoComplete="email"
                        errorMessage={errors.email}
                        hasError={!!(errors.email && touched.email)}
                        value={values.email}
                        autoCapitalize="none"
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
                        autoComplete="password"
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        errorMessage={errors.password}
                        hasError={!!(errors.password && touched.password)}
                        value={values.password}
                      />
                    </Box>
                    <Box w="full" mt={3}>
                      <Input
                        label="Confirm Password"
                        placeholder=""
                        isSecure
                        hasIcon
                        iconPosition="right"
                        autoComplete="password"
                        onChangeText={handleChange('confirm')}
                        onBlur={handleBlur('confirm')}
                        errorMessage={errors.confirm}
                        hasError={!!(errors.confirm && touched.confirm)}
                        value={values.confirm}
                      />
                    </Box>
                  </VStack>
                </VStack>
                <Box flexWrap="wrap" mt={1} mb={4} w="full">
                  <Checkbox
                    value={terms ? '1' : '0'}
                    color="themeDark.primary.base"
                    onChange={setTerms}>
                    <HStack
                      alignItems="center"
                      space={1}
                      justifyContent="center">
                      <Text>I accept</Text>
                      <Pressable
                        onPress={() =>
                          openBrowser(
                            'https://www.fastfastapp.com/terms-and-condition',
                          )
                        }>
                        <Text color="themeDark.primary.base">TOS</Text>
                      </Pressable>
                      <Text color="#000" _dark={{color: 'white.100'}}>
                        and
                      </Text>
                      <Pressable
                        onPress={() =>
                          openBrowser(
                            'https://www.fastfastapp.com/privacy-policy',
                          )
                        }>
                        <Text color="themeDark.primary.base">
                          Privacy Policy
                        </Text>
                      </Pressable>
                    </HStack>
                  </Checkbox>
                </Box>
                <Button
                  w="full"
                  rounded="60px"
                  py={4}
                  mb={3}
                  onPress={handleSubmit as any}
                  bg="themeLight.accent"
                  isDisabled={!emailGood || sendEmailToken.isLoading || !terms}
                  isLoading={sendEmailToken.isLoading}
                  isLoadingText="Processing..."
                  _text={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontFamily: 'body',
                  }}>
                  Next
                </Button>
                {ButtonWithSSO}
                <Center mb={8}>
                  <HStack space={2}>
                    <Text>Already have an account?</Text>
                    <Link
                      onPress={() => navigate('Auth', {screen: 'Login'})}
                      _text={{
                        fontWeight: 'bold',
                        fontFamily: 'body',
                        color: 'black',
                      }}>
                      Sign In
                    </Link>
                  </HStack>
                </Center>
              </>
            )}
          </Formik>
        </VStack>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <Box bg="rgba(0,0,0, .5)" flex={1} justifyContent="center" p={4}>
            <Center bg="white" w="full" rounded="md" p={4} px={4}>
              <Text fontWeight="bold" fontSize="md" mb={6} mt={4}>
                Continue where you left of?
              </Text>
              <Text
                fontSize="xs"
                color="trueGray.600"
                fontWeight="semibold"
                textAlign="center">
                We noticed you have a pending registration session. Would you
                like to continue where you left off?
              </Text>
              <HStack w="full" justifyContent="center" mt={6} space={2}>
                <Button
                  py={4}
                  px={8}
                  _text={{fontWeight: 'bold'}}
                  onPress={proceedPreviousSession}
                  rounded="full"
                  bg="themeLight.accent">
                  Yes Continue
                </Button>
                <Button
                  py={4}
                  px={8}
                  _text={{fontWeight: 'bold', color: 'themeLight.accent'}}
                  onPress={clearPreviousSession}
                  rounded="full"
                  borderColor="themeLight.accent"
                  variant="outline">
                  No Cancel
                </Button>
              </HStack>
            </Center>
          </Box>
        </Modal>
      </Box>
    </AuthLayout>
  );
});
