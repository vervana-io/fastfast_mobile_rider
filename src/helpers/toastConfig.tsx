import {Box, Center, HStack, Heading, Spinner, Text, VStack} from 'native-base';

/* eslint-disable react/react-in-jsx-scope */
import {CheckMarkSolid} from '@assets/svg/CheckMarkSolid';
import {CloseIconSolid} from '@assets/svg/closeIconSolid';
import {InfoIconSolid} from '@assets/svg/infoIconSolid';
import {WifiBallon} from '@assets/svg/WifiBallon';

export const toastConfig = {
  success: ({text1, props, text2}: any) => (
    <Box w="full" p="20px">
      <HStack
        h="82px"
        bg="white"
        rounded="lg"
        py={4}
        px={2}
        alignItems="center"
        justifyContent="space-between"
        space={2}>
        <Center w="32px" h="32px" bg="paypleGreen" rounded="full">
          <CheckMarkSolid />
        </Center>
        <Box flex={1}>
          <Heading size="sm" color="#135932">
            {text1}
          </Heading>
          <Text fontSize="14px" color="#135932">
            {text2}
          </Text>
        </Box>
      </HStack>
    </Box>
  ),

  error: ({text1, props, text2}: any) => (
    <Box w="full" p="20px">
      <HStack
        h="82px"
        bg="white"
        rounded="lg"
        py={4}
        px={2}
        alignItems="center"
        justifyContent="space-between"
        space={2}>
        <Center w="32px" h="32px" bg="danger.100" rounded="full">
          <CloseIconSolid />
        </Center>
        <Box flex={1}>
          <Heading size="sm" color="#D54444">
            {text1}
          </Heading>
          <Text fontSize="14px" color="#D54444">
            {text2}
          </Text>
        </Box>
      </HStack>
    </Box>
  ),

  warning: ({text1, props, text2}: any) => (
    <Box w="full" p="20px">
      <HStack
        h="82px"
        bg="white"
        rounded="lg"
        py={4}
        px={2}
        alignItems="center"
        justifyContent="space-between"
        space={2}>
        <Center w="32px" h="32px" bg="white" rounded="full">
          <InfoIconSolid />
        </Center>
        <Box flex={1}>
          <Heading size="sm" color="#B59900">
            {text1}
          </Heading>
          <Text fontSize="14px" color="#B59900">
            {text2}
          </Text>
        </Box>
      </HStack>
    </Box>
  ),

  info: ({text1, props, text2}: any) => (
    <Box w="full" p="20px">
      <HStack
        h="82px"
        bg="white"
        rounded="lg"
        py={4}
        px={2}
        alignItems="center"
        justifyContent="space-between"
        space={2}>
        <Center w="32px" h="32px" bg="white" rounded="full">
          <InfoIconSolid fill="#1d4ed8" />
        </Center>
        <Box flex={1}>
          <Heading size="sm" color="#60a5fa">
            {text1}
          </Heading>
          <Text fontSize="14px" color="#60a5fa">
            {text2}
          </Text>
        </Box>
      </HStack>
    </Box>
  ),

  noInternet: ({text1, props, text2}) => (
    <Box w="full" h="50px" px={4}>
      <Box bg="themeLight.error" w="full" h="full" rounded="lg" shadow={4}>
        <HStack
          flex={1}
          justifyContent="space-between"
          alignItems="center"
          px={4}>
          <HStack alignItems="center" space={4}>
            <Box>
              <WifiBallon width={30} height={30} fill="white" />
            </Box>
            <VStack>
              <Text color="white" fontWeight="bold">
                No Internet Connectivity
              </Text>
              <Text color="white" fontWeight="medium" fontSize="xs">
                Waiting for connection
              </Text>
            </VStack>
          </HStack>
          <Box>
            <Spinner color="white" />
          </Box>
        </HStack>
      </Box>
    </Box>
  ),

  hasInternet: ({text1, props, text2}) => (
    <Box w="full" h="50px" px={4}>
      <Box bg="themeLight.success" w="full" h="full" rounded="lg" shadow={4}>
        <HStack
          flex={1}
          justifyContent="space-between"
          alignItems="center"
          px={4}>
          <HStack alignItems="center" space={4}>
            <Box>
              <WifiBallon width={30} height={30} fill="white" />
            </Box>
            <VStack>
              <Text color="white" fontWeight="bold">
                Internet Connectivity
              </Text>
              <Text color="white" fontWeight="medium" fontSize="xs">
                Connection Established
              </Text>
            </VStack>
          </HStack>
        </HStack>
      </Box>
    </Box>
  ),
};
