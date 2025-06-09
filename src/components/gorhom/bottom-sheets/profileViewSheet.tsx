import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {
  Box,
  Center,
  ChevronRightIcon,
  HStack,
  Image,
  Link,
  Pressable,
  Text,
  VStack,
} from 'native-base';
import React, {useCallback, useEffect, useRef} from 'react';

import {IDCard} from '@assets/svg/idCard';
import {StarIcon} from '@assets/svg/StarIcon';
import {UserIcon} from '@assets/svg/UserIcon';
import {SheetHeader} from '@components/ui';
import {authStore} from '@store/auth';
import {bottomSheetStore} from '@store/bottom-sheet';
import dayjs from 'dayjs';
import {observer} from 'mobx-react-lite';
import {Platform} from 'react-native';
import {SheetManager} from 'react-native-actions-sheet';
import {WIN_HEIGHT} from '../../../config';

const complimentsList = [
  {
    image: require('@assets/img/Profile1.png'),
    rating: '4.5',
    name: 'Friendly',
    id: '1',
  },
  {
    image: require('@assets/img/Profile1.png'),
    rating: '4.5',
    name: 'Friendly',
    id: '2',
  },
  {
    image: require('@assets/img/Profile2.png'),
    rating: '4.5',
    name: 'Fast and decent',
    id: '3',
  },
  {
    image: require('@assets/img/Profile2.png'),
    rating: '4.5',
    name: 'Fast and decent',
    id: '4',
  },
];

export const ProfileViewSheet = observer(() => {
  const sheetRef: any = useRef<BottomSheet>(null);

  const sheetOpen = bottomSheetStore.sheets.profileViewSheet;

  const userD = authStore.auth;
  const height = Platform.OS === 'android' ? 0.9 : 0.8;

  const handleClosePress = () => sheetRef.current.close();
  const handleExpand = () => sheetRef.current.expand();

  const complements = ({item}: any) => (
    <Center>
      <Box w="96px" h="96px" rounded="full">
        <Image
          source={item.image}
          width="100%"
          height="100%"
          rounded="full"
          alt="profile image"
        />
      </Box>
      <HStack my={2}>
        <StarIcon />
        <StarIcon />
        <StarIcon />
        <StarIcon />
        <StarIcon fill="#E7D6C3" />
      </HStack>
      <Text fontSize="sm" color="themeLight.gray.2">
        {item.name}
      </Text>
    </Center>
  );

  const Content = useCallback(
    () => (
      <Box h={WIN_HEIGHT * height}>
        <BottomSheetScrollView>
          <SheetHeader sheetToClose="profileSheet" title="Profile" />
          <VStack space={3}>
            <Center>
              <Box w="150px" h="150px" rounded="full">
                <Image
                  source={
                    userD.rider?.selfie
                      ? {uri: userD.rider?.selfie}
                      : require('@assets/img/Profile1.png')
                  }
                  width="100%"
                  height="100%"
                  rounded="full"
                  alt="profile image"
                />
              </Box>
              <Text fontSize="24px" fontWeight="bold" mt={2}>
                {userD.rider?.first_name} {userD.rider?.last_name}
              </Text>
              <Text
                fontWeight="medium"
                my={2}
                fontSize="md"
                color="themeLight.gray.2">
                Delivering since {dayjs(userD.user?.created_at).format('YYYY')}
              </Text>
              <Link
                onPress={() => SheetManager.show('VehicleDetailsSheet')}
                _text={{fontSize: 'sm', color: 'themeLight.accent'}}
                isUnderlined={false}>
                See vehicle details
              </Link>
            </Center>
            <Center w="60%" my={4} mx="auto">
              <VStack w="full" space={6}>
                <Pressable
                  onPress={() => SheetManager.show('verifyIdentitySheet')}>
                  <HStack
                    space={2}
                    alignItems="center"
                    justifyContent="space-between">
                    <HStack space={2}>
                      <IDCard />
                      <Text fontSize="md">Verify your identity</Text>
                    </HStack>
                    <ChevronRightIcon />
                  </HStack>
                </Pressable>
                <Pressable
                  onPress={() => SheetManager.show('GuarantorFormSheet')}>
                  <HStack
                    space={2}
                    alignItems="center"
                    justifyContent="space-between">
                    <HStack space={2}>
                      <UserIcon />
                      <Text fontSize="md">Guarantor form</Text>
                    </HStack>
                    <ChevronRightIcon />
                  </HStack>
                </Pressable>
                {/* <Link
                  _text={{
                    fontSize: 'sm',
                    color: 'themeLight.accent',
                    textAlign: 'center',
                  }}
                  isUnderlined={false}>
                  View customer compliments
                </Link> */}
              </VStack>
              <HStack justifyContent="space-between" w="full" mt={8}>
                <VStack alignItems="center">
                  <Text fontWeight="bold" fontSize="24px">
                    {userD.rider?.deliveried_orders}
                  </Text>
                  <Text color="themeLight.gray.2">Deliveries</Text>
                </VStack>
                <VStack alignItems="center">
                  <Text fontWeight="bold" fontSize="24px">
                    {userD.rider?.ratings ?? 0.0}
                  </Text>
                  <Text color="themeLight.gray.2">Customer Rating</Text>
                </VStack>
              </HStack>
            </Center>

            {/* <BottomSheetFlatList
              data={complimentsList}
              horizontal={true}
              keyExtractor={item => item.id}
              renderItem={complements}
              //   contentContainerStyle={styles.contentContainer}
            /> */}
            {/* <Box
              alignItems="center"
              justifyContent="space-between"
              p={4}
              py={8}
              w="80%"
              mx="auto"
              rounded="lg"
              h="238px"
              bg="themeLight.primary.light1">
              <Text color="themeLight.gray.2">Personal statement</Text>
              <Text
                color="themeLight.gray.2"
                fontWeight="bold"
                fontSize="lg"
                textAlign="center">
                “I make fast delivery my priority”
              </Text>
              <Button
                bg="white"
                px={12}
                rounded="full"
                _text={{color: 'black', fontWeight: 'bold'}}>
                Edit
              </Button>
            </Box> */}
            {/* <Box px={8} py={6}>
              <Heading>Customer Compliments</Heading>
              <ScrollView
                scrollEnabled={true}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{marginVertical: 9}}>
                <FlatList
                  data={complimentsList}
                  renderItem={complements}
                  horizontal={true}
                  keyExtractor={item => item.id}
                />
              </ScrollView>
            </Box> */}
          </VStack>
        </BottomSheetScrollView>
      </Box>
    ),
    [
      height,
      userD.rider?.deliveried_orders,
      userD.rider?.first_name,
      userD.rider?.last_name,
      userD.rider?.ratings,
      userD.rider?.selfie,
      userD.user?.created_at,
    ],
  );

  useEffect(() => {
    if (sheetOpen) {
      handleExpand;
    } else {
      handleClosePress;
      bottomSheetStore.SetSheet('profileViewSheet', false);
    }
  }, [sheetOpen]);

  return (
    sheetOpen && (
      <BottomSheet>
        <BottomSheetView>
          <Content />
        </BottomSheetView>
      </BottomSheet>
    )
  );
});
