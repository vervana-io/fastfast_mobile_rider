import {
  Box,
  Button,
  Center,
  HStack,
  Heading,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';

import {AuthLayout} from '@layouts/authLayout';
import {BackButton} from '@components/ui';
import Clipboard from '@react-native-clipboard/clipboard';
import {Input} from '@components/inputs';
import {Keyboard} from 'react-native';
import Toast from 'react-native-toast-message';
import {WIN_WIDTH} from '../../config';
import {apiType} from '@types/apiTypes';
import {authStore} from '@store/auth';
import {navigate} from '@navigation/NavigationService';
import {registerStoreType} from '@types/authType';
import {showMessage} from 'react-native-flash-message';
import {useAuth} from '@hooks/useAuth';
import {useFocusEffect} from '@react-navigation/native';

interface ValidationType {
  navigation: any;
  route?: any;
}

export const Validation = (props: ValidationType) => {
  const {route, navigation} = props;
  const [countdown, setCountdown] = useState<number>(60);

  const {params} = route?.params;

  /**
   * this to carry
   * Status: true/false
   * route: route name only
   */
  const redirectRule = params.redirectRule; // this must be an object carrying navigation name and status

  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [pin3, setPin3] = useState('');
  const [pin4, setPin4] = useState('');
  const [pin5, setPin5] = useState('');

  const [buttonActive, setButtonActive] = useState<boolean>(true);
  const [validated, setValidated] = useState(true);

  const pin1Ref: any = React.useRef(null);
  const pin2Ref: any = React.useRef(null);
  const pin3Ref: any = React.useRef(null);
  const pin4Ref: any = React.useRef(null);
  const pin5Ref: any = React.useRef(null);

  const {validateEmailToken, sendEmailToken, register} = useAuth();

  const resetPins = () => {
    setPin1('');
    setPin2('');
    setPin3('');
    setPin4('');
    // setPin5('');
  };

  const handleInputChange = async (value: string, inputNumber: number) => {
    if (value === '') {
      switch (inputNumber) {
        case 1:
          pin1Ref?.current.focus();
          setPin1(value);
          break;
        case 2:
          pin1Ref?.current.focus();
          setPin2(value);
          break;
        case 3:
          pin2Ref?.current.focus();
          setPin3(value);
          break;
        case 4:
          pin3Ref?.current.focus();
          setPin4(value);
          break;
        // case 5:
        //   setPin5(value);
        //   break;
        default:
          break;
      }
    } else {
      checkClipboard(value, inputNumber);
    }
  };

  const handleLastInputChange = (value: string) => {
    setPin4(value);
    // Access all input values
    const allInputValues = [pin1, pin2, pin3, pin4, value];
    // Call your function with all input values
    if (value !== '') {
      Keyboard.dismiss();
      processCode(allInputValues);
    }
  };

  const manualValidateTrigger = () => {
    const allInputValues = [pin1, pin2, pin3, pin4];
    // Call your function with all input values
    Keyboard.dismiss();
    processCode(allInputValues);
  };

  const processCode = (inputValues: string[]) => {
    const pin = inputValues;
    let nPin = pin.join(',');
    nPin = nPin.replaceAll(',', '');
    Clipboard.setString('');
    console.log('N Pin', nPin);
    if (nPin.length > 0) {
      validateEmailToken.mutate(
        {email: params.email, token: nPin},
        {
          onSuccess: (val: apiType) => {
            if (val.status) {
              setValidated(false);
              proceed();
            } else {
              resetPins();
              showMessage({
                type: 'danger',
                message: val.message,
              });
              setValidated(true);
            }
          },
        },
      );
    }
  };

  const doRegister = () => {
    register.mutate(params, {
      onSuccess: (val: apiType) => {
        console.log('res', val);
        if (val.status) {
          navigate('Completion', undefined);
        } else {
          console.log(val);
          Toast.show({
            type: 'error',
            text1: 'Create Account',
            text2: 'error here',
          });
        }
      },
    });
  };

  // detect clipboard for code
  const checkClipboard = async (value: string, inputNumber: number) => {
    const content = await Clipboard.getString();
    if (content.length === 4 && /^\d+$/.test(content)) {
      pin1Ref?.current.focus();
      setPin1(content[0]);
      setPin2(content[1]);
      setPin3(content[2]);
      setPin4(content[3]);
      processCode(content.split(''));
      // setCode(content.split(''));
    } else {
      switch (inputNumber) {
        case 1:
          setPin1(value);
          break;
        case 2:
          setPin2(value);
          break;
        case 3:
          setPin3(value);
          break;
        case 4:
          setPin4(value);
          handleLastInputChange(value);
          break;
        // case 5:
        //   setPin5(value);
        //   break;
        default:
          break;
      }
    }
  };

  // 6456

  useEffect(() => {
    const interval = setInterval(() => {
      if (countdown > 0) {
        setCountdown(prevCountdown => prevCountdown - 1);
      } else {
        setButtonActive(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  // we use this to detect clipboard for code
  // useFocusEffect(
  //   useCallback(() => {
  //     if (pin1 === '') {
  //       checkClipboard();
  //       const interval = setInterval(checkClipboard, 1000); // Check every second
  //       return () => clearInterval(interval);
  //     }
  //   }, [pin1]),
  // );

  // Convert seconds to minutes and seconds
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  const requestCode = () => {
    // sendToken.mutate(
    //   {phone_number: params.phone_number},
    //   {
    //     onSuccess: (val: apiType) => {
    //       if (val.status) {
    //         setCountdown(120);
    //         setButtonActive(true);
    //       }
    //     },
    //   },
    // );
    sendEmailToken.mutate(
      {email: params.email},
      {
        onSuccess: (val: apiType) => {
          if (val.status) {
            setCountdown(120);
            setButtonActive(true);
          }
        },
      },
    );
  };

  const proceed = () => {
    if (redirectRule.status) {
      const det: registerStoreType = {
        registerData: params.data.registerData,
        step: 2,
      };
      authStore.setRegisterData(det);
      navigation.navigate(redirectRule.route, {params: det});
    } else {
      doRegister();
    }
  };

  // we need to check if we have any params and we don't have step, if we do then
  // we assume the user is a returning user so reset the request button
  useEffect(() => {
    const step = params?.step;
    if (step) {
      setCountdown(0);
    }
  }, [params, params?.step]);

  return (
    <AuthLayout>
      <Box flex={1} p={6}>
        <BackButton />
        <VStack my={8} flex={1}>
          <Box w={WIN_WIDTH * 0.7}>
            <Heading mb={2} size="lg">
              Enter 4-digit Verification code
            </Heading>
            <Text>
              Code sent to {params.email} . This code will expire in 10mins
            </Text>
          </Box>
          <Center>
            <HStack space={4} mt={4}>
              <Box>
                <Input
                  label=""
                  px={4}
                  h={12}
                  w={12}
                  // onChangeText={(e: string) => setPin1(e)}
                  onChangeText={value => handleInputChange(value, 1)}
                  borderRadius={14}
                  fontSize="25px"
                  maxLength={1}
                  bgColor="#E0E0E0"
                  borderWidth={0}
                  keyboardType="number-pad"
                  ref={pin1Ref}
                  value={pin1}
                  onChange={() => pin2Ref?.current.focus()}
                />
              </Box>
              <Box>
                <Input
                  label=""
                  keyboardType="number-pad"
                  ref={pin2Ref}
                  value={pin2}
                  onChange={() => pin3Ref?.current.focus()}
                  px={4}
                  h={12}
                  w={12}
                  // onChangeText={(e: string) => setPin2(e)}
                  onChangeText={value => handleInputChange(value, 2)}
                  borderRadius={14}
                  fontSize="25px"
                  maxLength={1}
                  bgColor="#E0E0E0"
                  borderWidth={0}
                />
              </Box>
              <Box>
                <Input
                  label=""
                  keyboardType="number-pad"
                  ref={pin3Ref}
                  value={pin3}
                  onChange={() => pin4Ref?.current.focus()}
                  px={4}
                  h={12}
                  w={12}
                  // onChangeText={(e: string) => setPin3(e)}
                  onChangeText={value => handleInputChange(value, 3)}
                  borderRadius={14}
                  fontSize="25px"
                  maxLength={1}
                  bgColor="#E0E0E0"
                  borderWidth={0}
                />
              </Box>
              <Box>
                <Input
                  label=""
                  keyboardType="number-pad"
                  ref={pin4Ref}
                  value={pin4}
                  // onChange={() => pin5Ref?.current.focus()}
                  px={4}
                  h={12}
                  w={12}
                  // onChangeText={(e: string) => setPin4(e)}
                  onChangeText={value => handleInputChange(value, 4)}
                  borderRadius={14}
                  fontSize="25px"
                  maxLength={1}
                  bgColor="#E0E0E0"
                  borderWidth={0}
                />
              </Box>
              {/* <Box>
                <Input
                  label=""
                  keyboardType="number-pad"
                  ref={pin5Ref}
                  value={pin5}
                  px={4}
                  h={12}
                  w={12}
                  // onChangeText={(e: string) => setPin5(e)}
                  onChangeText={value => handleLastInputChange(value)}
                  onBlur={() => console.log('oops')}
                  borderRadius={14}
                  fontSize="25px"
                  maxLength={1}
                  bgColor="#E0E0E0"
                  borderWidth={0}
                />
              </Box> */}
            </HStack>
          </Center>
          {validateEmailToken.isLoading && (
            <Box p={8}>
              <Spinner />
            </Box>
          )}
          <Center mt={6}>
            <HStack space={1}>
              <Text>Request new code in</Text>
              <Text color="themeLight.accent" fontWeight="bold">
                {String(minutes).padStart(2, '0')}:
                {String(seconds).padStart(2, '0')}
              </Text>
            </HStack>
            <Button
              mt={2}
              isDisabled={buttonActive}
              onPress={requestCode}
              isLoading={sendEmailToken.isLoading}
              isLoadingText="Requesting..."
              bg="themeLight.primary.base"
              _text={{fontWeight: 'semibold'}}>
              Request
            </Button>
          </Center>
        </VStack>
        <VStack space={2} mb={8}>
          <Button
            variant="outline"
            borderColor="themeLight.primary.base"
            rounded="3xl"
            py={4}
            onPress={() => navigate('SignUpStep2', {params: params})}
            _text={{
              fontWeight: 'bold',
              color: 'themeLight.primary.base',
            }}>
            Cancel
          </Button>
          {!validated ? (
            <Button
              borderColor="themeLight.primary.base"
              bg="themeLight.accent"
              rounded="3xl"
              py={4}
              isLoading={register.isLoading}
              isLoadingText="Registering..."
              isDisabled={validated}
              onPress={proceed}
              _text={{fontWeight: 'bold', color: 'white'}}>
              Next
            </Button>
          ) : (
            <Button
              borderColor="themeLight.primary.base"
              bg="themeLight.accent"
              rounded="3xl"
              py={4}
              isLoading={validateEmailToken.isLoading}
              isLoadingText="Validating..."
              isDisabled={validateEmailToken.isLoading}
              onPress={manualValidateTrigger}
              _text={{fontWeight: 'bold', color: 'white'}}>
              Validate Token
            </Button>
          )}
        </VStack>
      </Box>
    </AuthLayout>
  );
};
