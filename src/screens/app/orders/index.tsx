/* eslint-disable react-native/no-inline-styles */
import {
  Box,
  Button,
  Center,
  FlatList,
  HStack,
  Heading,
  QuestionIcon,
  Skeleton,
  Text,
  VStack,
} from 'native-base';
import {Linking, useWindowDimensions} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';

import {DefaultLayout} from '@layouts/default';
import {LocationPin} from '@assets/svg/LocationPin';
import {LocationPin2} from '@assets/svg/LocationPin2';
import {PhoneIcon} from '@assets/svg/PhoneIcon';
import {SheetManager} from 'react-native-actions-sheet';
import {TimeIcon} from '@assets/svg/TimeIcon';
import dayjs from 'dayjs';
import {observer} from 'mobx-react-lite';
import { orderTypes } from '@types/orderTypes';
import {ordersStore} from '@store/orders';
import {useOrders} from '@hooks/useOrders';

interface OrdersScreenProps {
  navigation?: any;
}

export const OrdersScreen = observer((props: OrdersScreenProps) => {
  const {navigation} = props;
  const layout = useWindowDimensions();

  const {fetchOngoingOrders, orderStates} = useOrders();
  const {ordersData} = orderStates;

  const orders = ordersStore.orders;

  const [active, setIsActive] = useState([-1]);

  const callCustomer = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const LazyPlaceholder = () => (
    <VStack
      w="90%"
      m={4}
      borderWidth="1"
      space={8}
      overflow="hidden"
      rounded="md"
      _dark={{
        borderColor: 'coolGray.300',
      }}
      _light={{
        borderColor: 'coolGray.100',
      }}>
      <Skeleton h="40" />
      <Skeleton.Text px="4" />
      <Skeleton px="4" my="4" rounded="full" startColor="primary.50" />
    </VStack>
  );

  const openOrder = (order_id: number, item: orderTypes) => {
    navigation.navigate('Home');
    ordersStore.setSelectedOrderId(order_id);
    ordersStore.setSelectedOrder(item);
    SheetManager.show('orderDetailsSheet', {payload: {order_id}});
  };

  const Pickup = useCallback(
    () => (
      <VStack space={2} flex={1} py={4}>
        {fetchOngoingOrders.isLoading ? (
          <LazyPlaceholder />
        ) : !fetchOngoingOrders.isLoading && orders.length > 0 ? (
          <FlatList
            data={orders}
            renderItem={({item}) => (
              <Box py={6} px={4} bg="white" rounded="2xl" shadow="56" mb={4}>
                <HStack justifyContent="space-between" space={2}>
                  <VStack flex={1} space={2}>
                    <Text fontWeight="bold" fontSize="lg">
                      {item.seller.trading_name}
                    </Text>
                    <HStack space={2} alignItems="center">
                      <HStack alignItems="center" space={1}>
                        <TimeIcon width={12} />
                        <Text color="themeLight.gray.2" fontSize="xs">
                          {dayjs(item.created_at).format('HH:MM')}
                        </Text>
                      </HStack>
                      {/* <HStack space={1} alignItems="center">
                        <LocationPin2 width={12} />
                        <Text color="themeLight.gray.2" fontSize="xs">
                          1.5km
                        </Text>
                      </HStack> */}
                    </HStack>
                  </VStack>
                  <HStack space={2}>
                    <Button
                      leftIcon={<QuestionIcon />}
                      w="44px"
                      h="44px"
                      rounded="2xl"
                      onPress={() => SheetManager.show('orderHelpSheet')}
                      bg="#1B1B1B"
                      _pressed={{bg: 'rgba(255,255,255, .4)'}}
                    />
                    <Button
                      leftIcon={<PhoneIcon stroke="white" />}
                      w="44px"
                      h="44px"
                      rounded="2xl"
                      onPress={() =>
                        callCustomer(item?.customer.phone_number_one)
                      }
                      bg="#1B1B1B"
                      _pressed={{bg: 'rgba(255,255,255, .4)'}}
                    />
                  </HStack>
                </HStack>
                <VStack mt={4}>
                  <VStack>
                    <HStack alignItems="center" space={2}>
                      <Center
                        w="16px"
                        h="16px"
                        ml={1}
                        rounded="full"
                        borderWidth={1}
                        borderColor="black">
                        <Box />
                      </Center>
                      <Text flex={1}>{item?.seller.address}</Text>
                    </HStack>
                    <Box
                      mx={2.5}
                      my={1}
                      h="30px"
                      w="0.2px"
                      borderWidth={1}
                      borderStyle="dashed"
                      borderColor="black"
                    />
                  </VStack>
                  <VStack>
                    <HStack alignItems="center" space={2}>
                      <LocationPin />
                      <Text flex={1}>
                        {item?.address.house_number} {item?.address.street}{' '}
                        {item?.address.city} {item?.address.state}
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
                <Box mt={2}>
                  <HStack
                    justifyContent="space-between"
                    alignItems="center"
                    mb={4}>
                    <Text fontWeight="bold">Fee: ₦{item.total_amount}</Text>
                    <Text fontWeight="bold">
                      Code: #
                      {item.status === '3'
                        ? item.delivery_pin
                        : item.pick_up_pin}
                    </Text>
                  </HStack>
                  <Button
                    _text={{fontWeight: 'bold'}}
                    rounded="full"
                    py={4}
                    onPress={() => openOrder(item.id, item)}>
                    Open order
                  </Button>
                </Box>
              </Box>
            )}
            keyExtractor={item => item.id.toString()}
          />
        ) : null}
      </VStack>
    ),
    [fetchOngoingOrders.isLoading, orders],
  );

  const Completted = useCallback(
    () => (
      <VStack space={2} flex={1} py={4}>
        <Box py={6} px={4} bg="white" rounded="2xl" shadow="56">
          <HStack justifyContent="space-between" space={2}>
            <VStack flex={1} space={2}>
              <Text fontWeight="bold" fontSize="lg">
                Kings of Wings
              </Text>
              <Text color="themeLight.gray.2" fontSize="xs">
                ILUPEJU BUS-STOP, IKEJA, LAGOS, IKEJA, LAGOS
              </Text>
            </VStack>
            <HStack space={2}>
              <Button
                leftIcon={<QuestionIcon />}
                w="44px"
                h="44px"
                rounded="2xl"
                onPress={() => SheetManager.show('orderHelpSheet')}
                bg="#1B1B1B"
                _pressed={{bg: 'rgba(255,255,255, .4)'}}
              />
              <Button
                leftIcon={<PhoneIcon stroke="white" />}
                w="44px"
                h="44px"
                rounded="2xl"
                onPress={() => {}}
                bg="#1B1B1B"
                _pressed={{bg: 'rgba(255,255,255, .4)'}}
              />
            </HStack>
          </HStack>
          <Box mt={2}>
            <Text fontWeight="bold">Fee: ₦2000</Text>
            <VStack bg="themeLight.gray.4" rounded="lg" my={4} p={4} space={2}>
              <Text color="black">1x Chicken Wing</Text>
              <Text color="black">1x Chicken Wing</Text>
              <Text color="black">1x Chicken Wing</Text>
            </VStack>
            <Button _text={{fontWeight: 'bold'}} rounded="full" py={4}>
              View Details
            </Button>
          </Box>
        </Box>
      </VStack>
    ),
    [],
  );

  const renderScene = SceneMap({
    first: Pickup,
    second: Completted,
  });

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Ongoing Request'},
    {key: 'second', title: 'completted Request'},
  ]);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: 'green', // Color for the selected tab
        height: '100%', // Make the indicator take the full height of the tab bar
        borderRadius: 25, // Optional: Add border radius to match the tab bar
      }}
      style={{
        backgroundColor: 'white',
        borderRadius: 25,
        overflow: 'hidden',
        margin: 1,
      }}
      tabStyle={{padding: 2}}
      indicatorContainerStyle={{margin: 3}}
      renderLabel={({route, focused}) => (
        <Text
          style={{
            color: focused ? 'white' : 'black',
            textAlign: 'center', // Center the text
            alignItems: 'center',
            fontWeight: 'bold',
          }}>
          {route.title}
        </Text>
      )}
    />
  );

  useEffect(() => {
    if (index === 0) {
      fetchOngoingOrders.mutate({
        page: 1,
        per_page: 6,
        status: '1',
      });
    } else if (index === 1) {
      // fetchOngoingOrders.mutate({
      //   page: 1,
      //   per_page: 6,
      //   status: '4',
      // });
    }
  }, [index]);

  const refreshData = () => {
    // refresh all required data here
    if (index === 0) {
      fetchOngoingOrders.mutate({
        page: 1,
        per_page: 6,
        status: '1',
      });
    } else if (index === 1) {
      // fetchOngoingOrders.mutate({
      //   page: 1,
      //   per_page: 6,
      //   status: '4',
      // });
    }
  };

  return (
    <DefaultLayout refreshable={true} shouldRefresh={refreshData}>
      <Box flex={1} bg="themeLight.gray.4" p={4}>
        <Heading size="md">All Orders</Heading>
        <Box flex={1} mt={2}>
          <TabView
            lazy
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderLazyPlaceholder={LazyPlaceholder}
            initialLayout={{width: layout.width}}
            renderTabBar={renderTabBar}
          />
        </Box>
      </Box>
    </DefaultLayout>
  );
});
