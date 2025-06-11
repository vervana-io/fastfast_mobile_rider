import {
  Box,
  Button,
  Center,
  CheckIcon,
  CloseIcon,
  HStack,
  Text,
  VStack,
} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';

import {SheetManager} from 'react-native-actions-sheet';
import {StyleSheet} from 'react-native';
import {UsePusher} from '@hooks/usePusher';
import {WIN_WIDTH} from '../../../../config';
import {addressesStore} from '@store/addresses';
import {authStore} from '@store/auth';
import {bottomSheetStore} from '@store/bottom-sheet';
import {checklist} from '@store/checklist';
import {observer} from 'mobx-react-lite';

export const Todos = observer(() => {
  const ChecklistData = checklist.checklist;
  const addressStore = addressesStore.selectedAddress;

  const userD = authStore.auth;

  const [showProgress, setShowProgress] = useState(false);

  const calculatePercentage = () => {
    const completedTasks = ChecklistData.filter(
      task => task.completed === 1,
    ).length;
    const result = (completedTasks / ChecklistData.length) * 100;
    const res = parseInt(result.toFixed(2), 10);
    console.log('percentage', res);
    return res;
  };
  const percentage = calculatePercentage();

  const updateChecklist = useCallback(() => {
    // first we check if identity is verified
    if (userD.rider?.selfie) {
      checklist.updateCompletedByIndex(1);
    }
    // second we check if guarantor form is done
    if (userD.rider?.first_guarantor_name) {
      checklist.updateCompletedByIndex(2);
    }
    // now we check if an address has been set
    if (addressStore.latitude) {
      checklist.updateCompletedByIndex(3);
    }
  }, [
    addressStore.latitude,
    userD.rider?.first_guarantor_name,
    userD.rider?.selfie,
  ]);

  useEffect(() => {
    updateChecklist();
    // checklist.clearStoredData();
    setTimeout(() => {
      setShowProgress(true);
    }, 500);
  }, [updateChecklist]);

  const openSheet = (sheetName: any, sheetType: '1' | '2') => {
    if (sheetType === '1') {
      SheetManager.show(sheetName);
    } else {
      bottomSheetStore.SetSheet('guarantorView', true);
    }
  };

  const Incomplete = useCallback(
    () => (
      <Box>
        <Text color="black" fontWeight="bold">
          Incomplete verification
        </Text>
        <Text color="themeLight.gray.2" fontSize="xs">
          Complete your verification to start taking orders
        </Text>
        {showProgress && (
          <VStack my={4} w="full" h="4px" bg="gray.300" rounded="lg">
            <Box
              h="full"
              w={`${percentage}%`}
              bg="themeLight.primary.base"
              rounded="lg"
            />
          </VStack>
        )}
        <VStack flex={1} space={3}>
          {ChecklistData.map((el, i) => (
            <HStack justifyContent="space-between" key={i}>
              <HStack alignItems="center" space={2}>
                {el.status === 1 ? (
                  <Center
                    borderWidth={2}
                    borderColor="themeLight.primary.base"
                    rounded="full"
                    w="20px"
                    h="20px">
                    <CheckIcon color="themeLight.primary.base" size="xs" />
                  </Center>
                ) : (
                  <Center
                    borderWidth={2}
                    borderColor="themeLight.error"
                    rounded="full"
                    w="20px"
                    h="20px">
                    <CloseIcon size="xs" color="themeLight.error" />
                  </Center>
                )}
                <VStack>
                  <Text fontSize="md">{el.title}</Text>
                  <Text fontSize="xs">
                    Completion time: {el.completionTime}
                  </Text>
                </VStack>
              </HStack>
              {el.status === 1 ? (
                <Button
                  size="xs"
                  _text={{fontWeight: 'bold'}}
                  disabled
                  colorScheme="dark">
                  Verified
                </Button>
              ) : (
                <Button
                  size="xs"
                  _text={{fontWeight: 'bold'}}
                  onPress={() => openSheet(el.sheetName, el.sheetType)}
                  colorScheme="primary">
                  Verify
                </Button>
              )}
            </HStack>
          ))}
        </VStack>
      </Box>
    ),
    [ChecklistData, percentage, showProgress],
  );

  const Pending = useCallback(
    () => (
      <Box>
        <Text color="black" fontWeight="bold" mb={3}>
          Verification Pending
        </Text>
        <Text color="themeLight.gray.2" fontSize="xs">
          Your verification is pending approval, once approved you would be able
          to go online and receive orders
        </Text>
      </Box>
    ),
    [],
  );

  return (
    <Box position="absolute" width="full" p={4} zIndex={2} bottom="50px">
      <Box
        w="full"
        bg="white"
        rounded="md"
        h="full"
        p={4}
        style={style.shadow}
        borderWidth={1}
        borderColor="trueGray.300">
        {userD.user?.complaince_status === 2 &&
        userD.rider?.selfie &&
        userD.rider.first_guarantor_name
          ? Pending()
          : Incomplete()}
      </Box>
    </Box>
  );
});

const style = StyleSheet.create({
  shadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
});
