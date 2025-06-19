import {BackButton, SSOButtons} from '@components/ui';
import {Box, Button, Center, Heading, Spinner, Text, VStack} from 'native-base';
import React, {useEffect, useRef, useState} from 'react';
import {object, string} from 'yup';

import {DefaultLayout} from '@layouts/default';
import {Formik} from 'formik';
import {Input} from '@components/inputs';
import {Pattern} from '@assets/svg/Pattern';
import {Platform} from 'react-native';
import Toast from 'react-native-toast-message';
import {apiType} from '@types/apiTypes';
import {isValidPassword} from '@helpers/regex';
import messaging from '@react-native-firebase/messaging';
import {useAuth} from '@hooks/useAuth';

interface Step2Props {
  navigation?: any;
}

export const ForgotStep1 = (props: Step2Props) => {
  const {navigation} = props;
  const [emailGood, setEmailGood] = useState<boolean>(false);
  const {checkIfEmailExist, sendEmailToken} = useAuth();

  const ref: any = useRef(null);

  let regSchema = object({
    email: string().email().required('Email is required'),
  });

  const checkEmail = (email: string) => {
    if (email !== '') {
      checkIfEmailExist.mutate(
        {email},
        {
          onSuccess: (val: apiType) => {
            if (val.status) {
              setEmailGood(true);
            } else {
              setEmailGood(false);
              ref?.current?.setErrors({['email']: 'Email does not exist'});
            }
          },
        },
      );
    }
  };

  return (
    <DefaultLayout>
      <Box flex={1} p={6} bg="#F4F4F4">
        <Box position="absolute" top={0} w="full" left={0} zIndex={1}>
          <Pattern />
        </Box>
        <BackButton />
        <Box my={4} mt={8}>
          <Box>
            <Heading>Forgot your password?</Heading>
            <Text mt={2}>
              Provide your email so we can send you a recovery token
            </Text>
          </Box>
          <Formik
            initialValues={{email: ''}}
            validationSchema={regSchema}
            innerRef={ref}
            onSubmit={values => {
              sendEmailToken.mutate(
                {
                  email: values.email,
                },
                {
                  onSuccess: (val: apiType) => {
                    if (val.status) {
                      const upd = {
                        email: values.email,
                        redirectRule: {status: true, route: 'ForgotStep2'},
                      };
                      navigation.navigate('Validate', {params: upd});
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
              errors,
              touched,
              values,
            }) => (
              <Box mt={20}>
                <VStack space={3}>
                  <Box>
                    <Input
                      label="Email"
                      placeholder="Your email address"
                      value={values.email}
                      keyboardType="email-address"
                      fontSize={Platform.OS === 'ios' ? '15px' : '13px'}
                      py={Platform.OS === 'ios' ? 2 : 2}
                      onEndEditing={() => checkEmail(values.email)}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      errorMessage={errors.email}
                      hasError={errors.email && touched.email ? true : false}
                      autoCapitalize="none"
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
                </VStack>
                <Center>
                  <Button
                    bg="themeLight.accent"
                    _text={{fontWeight: 'bold'}}
                    w="full"
                    py={4}
                    my={8}
                    isLoading={sendEmailToken.isLoading}
                    isLoadingText="Sending token..."
                    isDisabled={!emailGood || sendEmailToken.isLoading}
                    onPress={() => handleSubmit()}
                    rounded="full">
                    Next
                  </Button>
                </Center>
              </Box>
            )}
          </Formik>
        </Box>
      </Box>
    </DefaultLayout>
  );
};
