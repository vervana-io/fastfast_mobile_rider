/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';

import {
  Badge,
  Box,
  ChevronRightIcon,
  HStack,
  Image,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import {Alert, Linking} from 'react-native';
import {getBuildNumber, getVersion} from 'react-native-device-info';

import {Dollar} from '@assets/svg/Dollar';
import {OrdersIcon} from '@assets/svg/OrdersIcon';
import {useAuth} from '@hooks/useAuth';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {addressesStore} from '@store/addresses';
import {authStore} from '@store/auth';
import {bottomSheetStore} from '@store/bottom-sheet';
import {ordersStore} from '@store/orders';
import {rootConfig} from '@store/root';
import {observer} from 'mobx-react-lite';
import {SheetManager} from 'react-native-actions-sheet';
import {WIN_WIDTH} from '../config';
import {Home} from '@screens/app';

const navOptions = {
  headerShown: false,
};

const DrawerOptions = {
  drawerStyle: {
    width: WIN_WIDTH * 0.8,
  },
};

const {Navigator, Screen} = createDrawerNavigator();
const AppStack = createStackNavigator();

const AppStackNavigator = () => (
  <AppStack.Navigator screenOptions={navOptions}>
    {/* <AppStack.Screen name="Dashboard" component={Dashboard} /> */}
    {/* <AppStack.Screen name="Home-root" component={Dashboard} /> */}
    <AppStack.Screen name="Home-root" component={Home} />
  </AppStack.Navigator>
);

const DrawerContent = observer(({navigation, state}: any) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [shoudLogout, setShouldLogout] = React.useState(false);

  const {logout} = useAuth();

  const userD = authStore.auth;
  const {city, house_number, street} = addressesStore.selectedAddress;

  let version = getVersion();
  let buildNumber = getBuildNumber();

  const selectedAddress = street
    ? `${house_number ?? ''} ${street ?? ''}, ${city ?? ''}, ${
        addressesStore.selectedAddress.state ?? ''
      }`
    : 'Click to select address';

  const Logout = () => {
    logout.mutate(
      {},
      {
        onSuccess: () => {
          navigation.closeDrawer();
          rootConfig.setIsOnline(false);
          bottomSheetStore.SetSheet('orderDetailsView', false);
          authStore.logout();
        },
      },
    );
  };

  const openSheet = (sheet: string) => {
    navigation.closeDrawer();
    SheetManager.show(sheet);
  };

  const navigateToScreen = (screen: string) => {
    navigation.navigate(screen);
    bottomSheetStore.SetSheet('orderDetailsView', false);
  };

  const openExtLink = (link: string) => {
    console.log('link ', link);
    Linking.canOpenURL(link).then(supported => {
      if (supported) {
        Linking.openURL(link);
      } else {
        Alert.alert("Sorry we can't open the provided link at this time");
      }
    });
  };

  return (
    <Box flex={1}>
      <ScrollView _contentContainerStyle={{flexGrow: 1}}>
        <Box safeAreaTop bg="transparent" />
        <VStack p={6} flex={1}>
          <Box>
            <Pressable onPress={() => openSheet('profileSheet')}>
              <HStack alignItems="center" space={4}>
                <Box w="48px" h="48px" rounded="full">
                  <Image
                    alt="Profile avatar"
                    width="100%"
                    height="100%"
                    source={
                      userD.rider?.selfie
                        ? {
                            uri: userD.rider?.selfie,
                          }
                        : require('@assets/img/Profile1.png')
                    }
                    rounded="full"
                  />
                </Box>
                <VStack flex={1}>
                  <Text fontWeight="bold" fontSize="sm" color="black">
                    {userD.rider?.first_name} {userD.rider?.last_name}
                  </Text>
                  <Text color="themeLight.gray.2" fontSize="xs" isTruncated>
                    {userD.user?.email}
                  </Text>
                </VStack>
                <ChevronRightIcon />
              </HStack>
            </Pressable>
          </Box>

          <VStack mt={8} space={3}>
            <Pressable py={2} onPress={() => openSheet('EarningsSheet')}>
              <HStack alignItems="center" space={2}>
                <Dollar />
                <Text>Earnings</Text>
              </HStack>
            </Pressable>
            <Pressable py={2} onPress={() => navigateToScreen('Orders')}>
              <HStack>
                <HStack
                  alignItems="center"
                  ml={-2}
                  space={2}
                  pl={ordersStore.ongoingOrderCount === 0 ? 2 : 0}>
                  {ordersStore.ongoingOrderCount > 0 && (
                    <Badge // bg="red.400"
                      colorScheme="danger"
                      rounded="full"
                      position="absolute"
                      right={0}
                      bottom={2}
                      mr={-6}
                      zIndex={1}
                      variant="solid"
                      alignSelf="flex-end"
                      _text={{
                        fontSize: 12,
                      }}>
                      {ordersStore.ongoingOrderCount}
                    </Badge>
                  )}
                  <OrdersIcon fill="#00C555" />
                  <Text>Orders</Text>
                </HStack>
              </HStack>
            </Pressable>
          </VStack>

          <VStack mt={12} space={0}>
            <Pressable py={2} onPress={() => openSheet('settingsSheet')}>
              <HStack alignItems="center" space={2}>
                <Text fontWeight="bold">Settings</Text>
              </HStack>
            </Pressable>
            <Pressable
              py={2}
              onPress={() =>
                openExtLink('https://www.fastfastapp.com/terms-and-condition')
              }>
              <HStack alignItems="center" space={2}>
                <Text fontWeight="bold">Help</Text>
              </HStack>
            </Pressable>
            <Pressable
              py={2}
              onPress={() => openExtLink('https://fastfastapp.com/faq')}>
              <HStack alignItems="center" space={2}>
                <Text fontWeight="bold">FAQs</Text>
              </HStack>
            </Pressable>
            <Pressable py={2} onPress={Logout}>
              <HStack alignItems="center" space={2}>
                {logout.isLoading && <Spinner />}
                <Text fontWeight="bold" color="themeLight.error">
                  Logout
                </Text>
              </HStack>
            </Pressable>
          </VStack>

          <Box mt={8}>
            <Text fontSize="sm" fontWeight="bold" color="trueGray.500">
              v{version}.({buildNumber})
            </Text>
          </Box>
        </VStack>
      </ScrollView>
    </Box>
  );
});

export function Drawer() {
  return (
    <Navigator
      screenOptions={DrawerOptions}
      drawerContent={props => <DrawerContent {...props} />}>
      <Screen options={navOptions} name="Home" component={AppStackNavigator} />
    </Navigator>
  );
}
