import {
  Box,
  Button,
  Center,
  CheckCircleIcon,
  CheckIcon,
  CloseIcon,
  HStack,
  Text,
  VStack,
} from 'native-base';

import {CheckMarkSolid} from '@assets/svg/CheckMarkSolid';
import React from 'react';
import {WIN_WIDTH} from '../../../../config';
import {checklist} from '@store/checklist';

export const Todos = () => {
  const ChecklistData = checklist.checklist;

  return (
    <Box width="full" p={4} zIndex={2} bottom={16}>
      <Box w="full" bg="white" rounded="md" h="273px" p={4}>
        <Text color="black" fontWeight="bold">
          Incomplete verification
        </Text>
        <Text color="themeLight.gray.2" fontSize="xs">
          Complete your verification to start taking orders
        </Text>
        <VStack my={4} bg="themeLight.gray.3" w="full" h="4px" rounded="lg">
          <Box w="30%" h="full" bg="themeLight.primary.base" rounded="lg" />
        </VStack>
        <VStack flex={1} space={3}>
          {ChecklistData.map((el, i) => (
            <HStack justifyContent="space-between" key={i}>
              <HStack alignItems="center" space={2}>
                <Center
                  borderWidth={2}
                  borderColor="themeLight.primary.base"
                  rounded="full"
                  w="20px"
                  h="20px">
                  {/* <CloseIcon size="xs" color="themeLight.primary.base" /> */}
                  <CheckIcon color="themeLight.primary.base" size="xs" />
                </Center>
                <Text>Vehicle verification</Text>
              </HStack>
              <Button size="xs" colorScheme="primary">
                Verify
              </Button>
            </HStack>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};
