import {Box, Center, Spinner, StatusBar} from 'native-base';
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
          showMessage({
            type: 'danger',
            message: 'You are not connected to the internet',
            position: 'top',
            autoHide: false,
          });
        }
      });
      console.log('user is logged in');
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
    <Center bg="themeLight.accent" flex={1}>
      <StatusBar backgroundColor="#009655" barStyle="light-content" />
      <Box position="absolute" top={0} w="full" left={0} zIndex={1}>
        <Pattern />
      </Box>
      <LogoText width={120} height={100} />

      {showConnectivity && (
        <Center>
          <Spinner mt={9} color="white" />
        </Center>
      )}
      {/* {!showConnectivity && fetchUser.isFetching && <Spinner mt={9} />} */}
    </Center>
  );
};
