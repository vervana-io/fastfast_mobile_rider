import {Box, Button, Center, Heading, Spinner, Text, VStack} from 'native-base';
import React, {useEffect, useRef, useState} from 'react';
import {object, string, ref as yref} from 'yup';

import {BackButton} from '@components/ui';
import {DefaultLayout} from '@layouts/default';
import {Formik} from 'formik';
import {Input} from '@components/inputs';
import {Pattern} from '@assets/svg/Pattern';
import Toast from 'react-native-toast-message';
import {__passwords__} from '@helpers/regex/constants';
import {useUser} from '@hooks/useUser';

interface Step2Props {
  navigation?: any;
  route?: any;
}

export const ForgotStep2 = (props: Step2Props) => {
  const {navigation, route} = props;
  const {params} = route.params;

  const {updatePasswordWithEmail} = useUser();

  const ref: any = useRef(null);

  let regSchema = object({
    password: string()
      .matches(
        __passwords__.M8L1D1S1.expression,
        'Password must contain Minimum eight characters, at least one letter, one number and one special character',
      )
      .required('Password is required'),

    confirm: string()
      .oneOf([yref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  return (
    <DefaultLayout>
      <Box flex={1} p={6} bg="#F4F4F4">
        <Box position="absolute" top={0} w="full" left={0} zIndex={1}>
          <Pattern />
        </Box>
        <BackButton />
        <Box my={4} mt={8}>
          <Box>
            <Heading>Create Your Account</Heading>
            <Text mt={2}>Let's create your account.</Text>
          </Box>
          <Formik
            initialValues={{password: '', confirm: ''}}
            validationSchema={regSchema}
            innerRef={ref}
            onSubmit={values => {
              updatePasswordWithEmail.mutate(
                {
                  email: params.email,
                  password: values.password,
                  password_confirmation: values.confirm,
                },
                {
                  onSuccess: (val: any) => {
                    console.log('res', val);
                    if (val.status) {
                      navigation.navigate('Login');
                    } else {
                      console.log(val);
                      Toast.show({
                        type: 'error',
                        text1: 'Forgot Password',
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
                      label="Password"
                      placeholder=""
                      value={values.password}
                      isSecure
                      hasIcon
                      iconPosition="right"
                      keyboardType="default"
                      // py={Platform.OS === 'ios' ? 4 : 2}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      errorMessage={errors.password}
                      hasError={
                        errors.password && touched.password ? true : false
                      }
                    />
                  </Box>
                  <Box>
                    <Input
                      label="Confirm Password"
                      placeholder=""
                      value={values.confirm}
                      isSecure
                      hasIcon
                      iconPosition="right"
                      keyboardType="default"
                      // py={Platform.OS === 'ios' ? 4 : 2}
                      onChangeText={handleChange('confirm')}
                      onBlur={handleBlur('confirm')}
                      errorMessage={errors.confirm}
                      hasError={
                        errors.confirm && touched.confirm ? true : false
                      }
                    />
                  </Box>
                </VStack>
                <Center>
                  <Button
                    bg="themeLight.accent"
                    _text={{fontWeight: 'bold'}}
                    w="full"
                    py={4}
                    my={8}
                    isLoading={updatePasswordWithEmail.isLoading}
                    isLoadingText="Updating..."
                    isDisabled={updatePasswordWithEmail.isLoading}
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
