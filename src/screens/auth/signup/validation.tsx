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
import React, {useEffect, useState} from 'react';

import {BackButton} from '@components/ui';
import {DefaultLayout} from '@layouts/default';
import {Input} from '@components/inputs';
import {Keyboard} from 'react-native';
import {apiType} from '@types/apiTypes';
import dayjs from 'dayjs';
import {navigate} from '@navigation/NavigationService';
import {showMessage} from 'react-native-flash-message';
import {useAuth} from '@hooks/useAuth';

interface ValidationType {
  route?: any;
}

export const Validation = (props: ValidationType) => {
  const {route} = props;
  const [countdown, setCountdown] = useState<number>(60);

  const regData = route?.params?.data;
  const rData = JSON.parse(regData);

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

  const {validateToken, sendToken} = useAuth();

  const resetPins = () => {
    setPin1('');
    setPin2('');
    setPin3('');
    setPin4('');
    setPin5('');
  };

  const handleInputChange = (value: string, inputNumber: number) => {
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
        break;
      case 5:
        setPin5(value);
        break;
      default:
        break;
    }
  };

  const handleLastInputChange = (value: string) => {
    setPin5(value);
    // Access all input values
    const allInputValues = [pin1, pin2, pin3, pin4, value];
    // Call your function with all input values
    if (value !== '') {
      Keyboard.dismiss();
      processCode(allInputValues);
    }
  };

  const processCode = (inputValues: string[]) => {
    const pin = inputValues;
    let nPin = pin.join(',');
    nPin = nPin.replaceAll(',', '');
    if (nPin.length > 0) {
      validateToken.mutate(
        {phone_number: rData.phone_number, pin: nPin},
        {
          onSuccess: (val: apiType) => {
            if (val.status) {
              setValidated(false);
            } else {
              resetPins();
              showMessage({
                type: 'danger',
                message: val.message,
              });
              setValidated(false);
            }
          },
        },
      );
    }
  };

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

  // Convert seconds to minutes and seconds
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  const requestCode = () => {
    sendToken.mutate(
      {phone_number: rData.phone_number},
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
    const old = JSON.stringify(rData);
    navigate('SignUpStep3', {data: old});
  };

  return (
    <DefaultLayout>
      <Box flex={1} p={6}>
        <BackButton />
        <VStack my={8} flex={1}>
          <Box w="60%">
            <Heading mb={2} size="lg">
              Enter 4-digit Verification code
            </Heading>
            <Text>
              Code sent to {rData.phone_number} . This code will expire in
              10mins
            </Text>
          </Box>
          <HStack justifyContent="space-between" mt={4}>
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
                onChange={() => pin5Ref?.current.focus()}
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
            <Box>
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
            </Box>
          </HStack>
          {validateToken.isLoading && (
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
              isLoading={sendToken.isLoading}
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
            onPress={() => navigate('SignUpStep2')}
            _text={{
              fontWeight: 'semibold',
              color: 'themeLight.primary.base',
            }}>
            Cencel
          </Button>
          <Button
            borderColor="themeLight.primary.base"
            bg="themeLight.accent"
            rounded="3xl"
            py={4}
            isDisabled={validated}
            onPress={proceed}
            _text={{fontWeight: 'semibold', color: 'white'}}>
            Next
          </Button>
        </VStack>
      </Box>
    </DefaultLayout>
  );
};
