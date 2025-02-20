/* eslint-disable react-native/no-inline-styles */
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import {
  Box,
  Button,
  Center,
  HStack,
  Image,
  Link,
  Text,
  VStack,
} from 'native-base';
import React, {useCallback, useRef} from 'react';

import {SheetHeader} from '@components/ui';
import {WIN_HEIGHT} from '../../config';
import {authStore} from '@store/auth';
import {observer} from 'mobx-react-lite';

export const VehicleDetailsSheet = observer((props: SheetProps) => {
  const vehicleDetailsSheetRef = useRef<ActionSheetRef>(null);

  const userD = authStore.auth;

  const Content = useCallback(() => {
    return (
      <Box py={6} px={4} bg="#ffffff" h="full" roundedTop="2xl">
        <SheetHeader
          sheetToClose="VehicleDetailsSheet"
          title="Vehicle details"
        />
        <Box px={4} py={8}>
          <VStack>
            <Text mb={2}>License</Text>
            <Box h="159px" w="full" bg="gray.300" rounded="lg">
              <Image
                alt=""
                w="100%"
                h="100%"
                rounded="lg"
                source={{uri: userD.rider?.drivers_license ?? ''}}
              />
            </Box>
          </VStack>
          <HStack mt={4} justifyContent="space-between">
            <VStack>
              <Text color="#6F7175">Vehicle Type</Text>
              <Text textAlign="center" color="black" fontWeight="normal">
                {userD.rider?.vehicle_type}
              </Text>
            </VStack>
            <VStack>
              <Text color="#6F7175">Vehicle Brand</Text>
              <Text textAlign="center" color="black" fontWeight="normal">
                {userD.rider?.vehicle_brand}
              </Text>
            </VStack>
            <VStack>
              <Text color="#6F7175">Plate Number</Text>
              <Text textAlign="center" color="black" fontWeight="normal">
                {userD.rider?.vehicle_plate_number}
              </Text>
            </VStack>
          </HStack>
          <Button
            disabled
            colorScheme="dark"
            rounded="full"
            mt={6}
            _text={{fontWeight: 'bold'}}>
            Edit vehicle details
          </Button>
          <Center>
            <Link
              mt={4}
              textAlign="center"
              _text={{textAlign: 'center', color: 'themeLight.accent'}}>
              Please contact support to change vehicle details.
            </Link>
          </Center>
        </Box>
      </Box>
    );
  }, [userD.rider?.drivers_license]);

  return (
    <ActionSheet
      id={props.sheetId}
      ref={vehicleDetailsSheetRef}
      indicatorStyle={{
        width: 0,
      }}
      gestureEnabled={true}
      containerStyle={{
        height: WIN_HEIGHT * 0.9,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: 'white',
        // backgroundColor: colorMode === 'dark' ? '#111827' : '#fff',
      }}>
      {Content()}
    </ActionSheet>
  );
});
