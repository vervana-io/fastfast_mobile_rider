import {
  Box,
  Button,
  Center,
  ChevronRightIcon,
  HStack,
  Text,
  VStack,
} from 'native-base';
import React, {useEffect, useState} from 'react';

import {AuthLayout} from '@layouts/authLayout';
import {BackButton} from '@components/ui';
import {Calendar} from '@assets/svg/Calendar';
import {DefaultLayout} from '@layouts/default';
import {LocationPin} from '@assets/svg/LocationPin';
import {Modal} from 'react-native';
import {PackageIcon} from '@assets/svg/PackageIcon';
import {SignupTop} from './components/signupTop';
import {TimeIcon} from '@assets/svg/TimeIcon';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {authStore} from '@store/auth';
import {navigate} from '@navigation/NavigationService';
import {registerStoreType} from '@types/authType';

interface WorkListType {
  icon: any;
  title: string;
  description: string;
  id: number;
  days: number[];
}

const WorkList: WorkListType[] = [
  {
    id: 1,
    title: 'Full Time',
    description: '7 days/week',
    icon: <PackageIcon />,
    days: [0],
  },
  {
    id: 2,
    title: 'Part Time',
    description: '5 days/week',
    icon: <TimeIcon />,
    days: [1, 2, 3, 4, 5],
  },
  {
    id: 3,
    title: 'Weekend',
    description: 'Saturday & Sunday',
    icon: <Calendar />,
    days: [6, 7],
  },
];

export const SignUpStep1 = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const SelectChoice = (selected: WorkListType) => {
    if (selected.title) {
      const payload = {
        contract_type: selected.id,
        shift_data: selected.days,
      };
      const det: registerStoreType = {
        registerData: payload,
        step: 2,
      };
      authStore.setRegisterData(det);
      navigate('SignUpStep2', {data: payload});
    }
  };

  // we check if the user has a previous registration session
  // if they do, we redirect them to the previous session
  const proceedPreviousSession = () => {
    setModalVisible(false);
    const step = authStore.registerData.step;
    const registerData = authStore.registerData;
    if (step === 2) {
      navigate('SignUpStep2', {data: registerData});
    } else if (step === 5) {
      navigate('Validation', {
        params: registerData,
      });
    } else if (step === 3) {
      navigate('SignUpStep3', {data: registerData});
    } else if (step === 4) {
      navigate('SignUpStep4', {data: registerData});
    }
  };

  const clearPreviousSession = () => {
    authStore.setRegisterData({
      registerData: {},
      step: undefined,
    });
    setModalVisible(false);
  };

  useEffect(() => {
    if (authStore.registerData?.step) {
      setTimeout(() => {
        setModalVisible(true);
      }, 500);
    }
  }, []);

  return (
    <AuthLayout>
      <Box flex={1} p={6}>
        <BackButton />
        <VStack mt={8}>
          <SignupTop title="Contract Type" percentage="25" />
          <Text my={6}>Please choose how often you want to work</Text>
          <VStack space={4}>
            {WorkList.map((el, i) => (
              <TouchableOpacity key={i} onPress={() => SelectChoice(el)}>
                <HStack
                  justifyContent="space-between"
                  borderWidth={1}
                  borderColor="themeLight.gray.3"
                  rounded="lg"
                  alignItems="center"
                  shadow={0.5}
                  p={4}>
                  <HStack space={4} alignItems="center">
                    {el.icon}
                    <VStack>
                      <Text fontSize="20px" fontWeight="bold">
                        {el.title}
                      </Text>
                      <Text
                        fontSize="14px"
                        fontWeight="medium"
                        color="themeLight.gray.2">
                        {el.description}
                      </Text>
                    </VStack>
                  </HStack>
                  <ChevronRightIcon size={6} />
                </HStack>
              </TouchableOpacity>
            ))}
          </VStack>
        </VStack>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
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
                  onPress={() => proceedPreviousSession()}
                  rounded="full"
                  bg="themeLight.accent">
                  Yes Continue
                </Button>
                <Button
                  py={4}
                  px={8}
                  _text={{fontWeight: 'bold', color: 'themeLight.accent'}}
                  onPress={() => clearPreviousSession()}
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
};
