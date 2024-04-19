import ActionSheet, {
  ActionSheetRef,
  FlatList,
  ScrollView,
  SheetManager,
  SheetProps,
  useScrollHandlers,
} from 'react-native-actions-sheet';
/* eslint-disable react-native/no-inline-styles */
import {
  Box,
  Button,
  Center,
  ChevronRightIcon,
  HStack,
  Heading,
  Image,
  Link,
  Pressable,
  Spinner,
  Text,
  VStack,
  useToast,
} from 'native-base';
// import {NativeViewGestureHandler, ScrollView} from 'react-native-gesture-handler';
import React, {useCallback, useRef, useState} from 'react';

import {IDCard} from '@assets/svg/idCard';
import {Platform} from 'react-native';
import {SheetHeader} from '@components/ui';
import {StarIcon} from '@assets/svg/StarIcon';
import Toast from 'react-native-toast-message';
import {UserIcon} from '@assets/svg/UserIcon';
import {WIN_HEIGHT} from '../../config';
import {apiType} from '@types/index';
import {authStore} from '@store/auth';
import dayjs from 'dayjs';
import {observer} from 'mobx-react-lite';
import {uploadedOrderType} from '@types/generalType';
import {useUser} from '@hooks/useUser';

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

export const ProfileSheets = observer((props: SheetProps) => {
  const profileSheetRef = useRef<ActionSheetRef>(null);
  const [uploadedOrder, setUploadedOrder] = useState<uploadedOrderType>();
  const height = Platform.OS === 'android' ? 0.9 : 0.8;

  const userD = authStore.auth;

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
        <ScrollView
          contentContainerStyle={{flexGrow: 1, paddingBottom: 10}}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}>
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
                <Pressable>
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
                <Link
                  _text={{
                    fontSize: 'sm',
                    color: 'themeLight.accent',
                    textAlign: 'center',
                  }}
                  isUnderlined={false}>
                  View customer compliments
                </Link>
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
        </ScrollView>
      </Box>
    ),
    [
      height,
      uploadedOrder?.uri,
      userD.rider?.deliveried_orders,
      userD.rider?.first_name,
      userD.rider?.last_name,
      userD.rider?.ratings,
      userD.user?.created_at,
    ],
  );

  return (
    <ActionSheet
      id={props.sheetId}
      ref={profileSheetRef}
      indicatorStyle={{
        width: 40,
      }}
      containerStyle={{
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: '#fff',
      }}
      gestureEnabled={true}>
      <Content />
    </ActionSheet>
  );
});
