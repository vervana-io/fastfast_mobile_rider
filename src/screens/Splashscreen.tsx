import {Box, Center, Image, Spinner, StatusBar, VStack} from 'native-base';
import React, {useCallback, useEffect} from 'react';

import {LogoText} from '@assets/svg/LogoText';
import NetInfo from '@react-native-community/netinfo';
import {Pattern} from '@assets/svg/Pattern';
import {authStore} from '@store/auth';
import {rootConfig} from '@store/root';
import {showMessage} from 'react-native-flash-message';
import {useUser} from '@hooks/useUser';

interface SplashscreenProps {
  navigation?: any;
}

export const Splashscreen = (props: SplashscreenProps) => {
  const {navigation} = props;
  const [showConnectivity, setShowConnectivity] = React.useState(true);

  const userD = authStore;
  const root = rootConfig;

  const {userDetails} = useUser();

  const CheckUserValidity = useCallback(async () => {
    if (!userD.isLoggedIn) {
      // check first if user is new user
      if (root.newUser) {
        navigation.replace('Onboarding');
      } else {
        // navigate to auth screen as user is not logged in
        navigation.replace('Auth');
      }
    } else {
      NetInfo.addEventListener(state => {
        if (state.isConnected) {
          userDetails.refetch();
          if (!userDetails.isFetching && !userDetails.isError) {
            setShowConnectivity(false);
            navigation.navigate('App');
            // if (userD.lockPassCode === '') {
            //   navigation.navigate('Auth', {screen: 'CreatePasscode'});
            // } else {

            // }
          }
        } else {
          // add toast here for not connected to internet
          setShowConnectivity(true);
          // showMessage({
          //   type: 'danger',
          //   message: 'You are not connected to the internet',
          //   position: 'top',
          //   autoHide: false,
          // });
        }
      });
    }
  }, [navigation, root.newUser, userD.isLoggedIn, userDetails]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setTimeout(() => {
        CheckUserValidity();
      }, 500);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [CheckUserValidity, navigation]);

  return (
    <Center bg="white" flex={1}>
      <StatusBar backgroundColor="#009655" barStyle="light-content" />
      <Box w="full" h="full">
        <VStack
          position="absolute"
          top={0}
          w="full"
          h="full"
          justifyContent="center"
          alignItems="center">
          <Box mx="auto" w="200px" h="56.79px">
            <Image
              w="100%"
              h="100%"
              source={require('@assets/img/splashscreen/rider.png')}
              alt="splashscreen"
            />
          </Box>
          {showConnectivity && (
            <Center>
              <Spinner mt={9} color="themeLight.accent" size="lg" />
            </Center>
          )}
        </VStack>
        <Box
          position="absolute"
          bottom={0}
          zIndex={1}
          w="full"
          alignItems="center"
          justifyContent="center">
          <Image
            w="100%"
            h="220px"
            source={require('@assets/img/splashscreen/pattern.png')}
            alt="splashscreen"
          />
        </Box>
      </Box>
      {/* {!showConnectivity && fetchUser.isFetching && <Spinner mt={9} />} */}
    </Center>
  );
};
