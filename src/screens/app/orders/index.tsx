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
import React, {useCallback, useState} from 'react';
import {Linking, useWindowDimensions} from 'react-native';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';

import {BikeIcon} from '@assets/svg/BikeIcon';
import {LocationPin} from '@assets/svg/LocationPin';
import {PhoneIcon} from '@assets/svg/PhoneIcon';
import {TimeIcon} from '@assets/svg/TimeIcon';
import {BackButton} from '@components/ui';
import {formatter} from '@helpers/formatter';
import {useOrders} from '@hooks/useOrders';
import {DefaultLayout} from '@layouts/default';
import {bottomSheetStore} from '@store/bottom-sheet';
import {ordersStore} from '@store/orders';
import {rootConfig} from '@store/root';
import {orderType} from '@types/index';
import dayjs from 'dayjs';
import {observer} from 'mobx-react-lite';
import {SheetManager} from 'react-native-actions-sheet';
import Toast from 'react-native-toast-message';

interface OrdersScreenProps {
  navigation?: any;
}

export const OrdersScreen = observer((props: OrdersScreenProps) => {
  const {navigation} = props;
  const layout = useWindowDimensions();

  const userIsOnline = rootConfig.isOnline;

  const {fetchOngoingOrders, orderStates} = useOrders();
  const {ordersData} = orderStates;

  const orders: orderType[] = ordersStore.orders;

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

  // const openOrder = useCallback(
  //   (order_id: number, item: orderType) => {
  //     navigation.navigate('Home');
  //     if (userIsOnline) {
  //       console.log('something else.');
  //       ordersStore.setSelectedOrderId(order_id);
  //       // ordersStore.setSelectedOrder(item);
  //       // bottomSheetStore.SetSheet('orderDetailsView', true, {
  //       //   payload: {order_id: order_id},
  //       // });
  //     } else {
  //       Toast.show({
  //         type: 'warning',
  //         text1: 'Online status',
  //         text2: 'You need to go online before proceeding to an order',
  //       });
  //     }
  //   },
  //   [navigation],
  // );

  const openOrder = useCallback(
    (order_id: number, item: orderType) => {
      try {
        if (userIsOnline) {
          ordersStore.setSelectedOrder({});
          ordersStore.setSelectedOrderId(0);
          ordersStore.clearNotifiedOrder();
          ordersStore.setSelectedOrderId(order_id);
          ordersStore.setSelectedOrder(item);
          bottomSheetStore.SetSheet('orderDetailsView', true, {
            payload: {order_id: order_id},
          });
        } else {
          Toast.show({
            type: 'warning',
            text1: 'Online status',
            text2: 'You need to go online before proceeding to an order',
          });
        }
        navigation.navigate('Home');
      } catch (err) {
        console.error('[openOrder] Crash:', err);
      }
    },
    [navigation],
  );

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
                        {item?.address?.house_number} {item?.address?.street}{' '}
                        {item?.address?.city.name} {item?.address?.state.name}
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
                <Box mt={2}>
                  <HStack
                    justifyContent="space-between"
                    alignItems="center"
                    mb={4}>
                    <VStack>
                      <Text fontWeight="bold">
                        Delivery Fee: ₦{item.delivery_fee}
                      </Text>
                      {/* <Text fontWeight="bold">
                        Order Fee: ₦{item.sub_total}
                      </Text> */}
                    </VStack>
                    <Text fontWeight="bold">
                      Code: #
                      {item.status === 3 ? item.delivery_pin : item.pick_up_pin}
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
            keyExtractor={(item: orderType) => item.id.toString()}
          />
        ) : (
          <Center py={8}>
            <BikeIcon />
            <Text my={4}>No ongoing orders yet</Text>
          </Center>
        )}
      </VStack>
    ),
    [fetchOngoingOrders.isLoading, openOrder, orders],
  );

  const Completted = useCallback(
    () => (
      <VStack space={2} flex={1} py={4}>
        {fetchOngoingOrders.isLoading ? (
          <LazyPlaceholder />
        ) : !fetchOngoingOrders.isLoading && orders.length > 0 ? (
          <FlatList
            data={orders}
            renderItem={({item}) => (
              <VStack space={2} flex={1} py={4}>
                <Box py={6} px={4} bg="white" rounded="2xl" shadow="56">
                  <HStack justifyContent="space-between" space={2}>
                    <VStack flex={1} space={2}>
                      <Text fontWeight="bold" fontSize="lg">
                        {item.seller.trading_name}
                      </Text>
                      <Text color="themeLight.gray.2" fontSize="xs">
                        {item?.seller?.address}
                      </Text>
                    </VStack>
                    <HStack space={2}>
                      {/* <Button
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
                      /> */}
                    </HStack>
                  </HStack>
                  <Box mt={2}>
                    <Text fontWeight="bold">
                      Fee: ₦{formatter.formatCurrencySimple(item.delivery_fee)}
                    </Text>
                    <VStack
                      bg="themeLight.gray.4"
                      rounded="lg"
                      my={4}
                      p={4}
                      space={2}>
                      {item.order_products &&
                        item.order_products.map((el, i) => (
                          <Text color="black" key={i}>
                            {el.quantity}x {el.product?.title}
                          </Text>
                        ))}
                    </VStack>
                    {/* <Button _text={{fontWeight: 'bold'}} rounded="full" py={4}>
                      View Details
                    </Button> */}
                  </Box>
                </Box>
              </VStack>
            )}
            keyExtractor={(item: orderType) => item.id.toString()}
          />
        ) : (
          <Center py={8}>
            <BikeIcon />
            <Text my={4}>You have not completed any orders yet</Text>
          </Center>
        )}
      </VStack>
    ),
    [fetchOngoingOrders.isLoading, orders],
  );

  const renderScene = SceneMap({
    first: Pickup,
    second: Completted,
  });

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Ongoing Request'},
    {key: 'second', title: 'Completed Request'},
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

  const refreshData = () => {
    // refresh all required data here
    if (index === 0) {
      fetchOngoingOrders.mutate({
        page: 1,
        per_page: 6,
        status: '1',
      });
    } else if (index === 1) {
      fetchOngoingOrders.mutate({
        page: 1,
        per_page: 6,
        status: '2',
      });
    }
  };

  return (
    <DefaultLayout refreshable={true} shouldRefresh={refreshData}>
      <Box safeArea flex={1} bg="themeLight.gray.4" p={4}>
        <BackButton />
        <Heading size="md" mt={2}>
          All Orders
        </Heading>
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
