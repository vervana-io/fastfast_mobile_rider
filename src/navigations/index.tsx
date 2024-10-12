import {Completion, ForgotStep1, ForgotStep2, Login, Onboarding, SignUpStep1, SignUpStep2, SignUpStep3, SignUpStep4, Validation} from '@screens/auth';
import React, {useState} from 'react';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';

import {Drawer} from './drawer';
import {NavigationContainer} from '@react-navigation/native';
import {OrdersScreen} from '@screens/app';
import {SheetProvider} from 'react-native-actions-sheet';
import {Splashscreen} from '@screens/Splashscreen';
import {navigationRef} from './NavigationService';

const ScreenStack = createStackNavigator();

const navOptions = {
  headerShown: false,
};

const AuthStackNavigator = () => (
  <ScreenStack.Navigator
    screenOptions={{
      ...navOptions,
      ...TransitionPresets.RevealFromBottomAndroid,
      presentation: 'card',
    }}>
    <ScreenStack.Screen name="Login" component={Login} />
    <ScreenStack.Screen name="SignUpStep1" component={SignUpStep1} />
    <ScreenStack.Screen name="SignUpStep2" component={SignUpStep2} />
    <ScreenStack.Screen name="SignUpStep3" component={SignUpStep3} />
    <ScreenStack.Screen name="SignUpStep4" component={SignUpStep4} />
    <ScreenStack.Screen name="Validation" component={Validation} />
    <ScreenStack.Screen name="Completion" component={Completion} />
    <ScreenStack.Screen name="ForgotStep1" component={ForgotStep1} />
    <ScreenStack.Screen name="ForgotStep2" component={ForgotStep2} />
  </ScreenStack.Navigator>
);

const ScreenStackNavigator = () => (
  <ScreenStack.Navigator
    screenOptions={{
      ...navOptions,
      ...TransitionPresets.ScaleFromCenterAndroid,
      presentation: 'card',
    }}>
    <ScreenStack.Screen name="Splashscreen" component={Splashscreen} />
    <ScreenStack.Screen name="App" component={Drawer} />
    <ScreenStack.Screen name="Onboarding" component={Onboarding} />
    <ScreenStack.Screen name="Auth" component={AuthStackNavigator} />
    <ScreenStack.Screen name="Orders" component={OrdersScreen} />
  </ScreenStack.Navigator>
);

export const AppNavigator = () => {
  //   const navigationRef = navigationRef;
  const [routeName, setRouteName] = useState();

  return (
    <NavigationContainer
      ref={navigationRef}
      // linking={linking}
      //   onReady={() => {
      //     setRouteName(navigationRef.getCurrentRoute());
      //   }}
      //   onStateChange={async () => {
      //     const previousRouteName = routeName;
      //     // const currentRouteName = navigationRef.getCurrentRoute();
      //     console.log('route', previousRouteName);
      //     // setRouteName(currentRouteName);
      //   }}
    >
      <SheetProvider>
        <ScreenStackNavigator />
      </SheetProvider>
    </NavigationContainer>
  );
};
