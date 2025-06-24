import {
  appleAuth,
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Button, VStack } from 'native-base';
import React, { useCallback } from 'react';
import { Alert, Platform } from 'react-native';

import { AppleIcon } from '@assets/svg/AppleIcon.tsx';
import { GoogleIcon } from '@assets/svg/GoogleIcon';
import { useAuth } from '@hooks/useAuth';
import { navigate } from '@navigation/NavigationService';
import messaging from '@react-native-firebase/messaging';
import { authStore } from '@store/auth';
import { apiType } from '@types/apiTypes';
import { registerStoreType } from '@types/authType';
import Toast from 'react-native-toast-message';

GoogleSignin.configure({
  webClientId:
    '862410060924-hqcggk82mce69aiunfufj9dmd1luk36b.apps.googleusercontent.com',
  offlineAccess: true,
});

interface SSOButtonsProps {
  navigation?: any;
  showLoading?: any;
  type?: 'login' | 'signup';
  idToken?: any;
  data?: any;
}

export const SSOButtons = (props: SSOButtonsProps) => {
  const {navigation, showLoading, type, idToken, data} = props;
  const {loginWithSSO, registerWithSSO} = useAuth();

  const signInGoogle = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // const googleTokens = await GoogleSignin.getTokens();
      const response = await GoogleSignin.signIn();
      const token = await messaging().getToken();
      if (isSuccessResponse(response)) {
        const gToken = response.data.idToken;
        if (type === 'signup') {
          if (gToken) {
            const payload = {
              provider: 'google',
              token: gToken,
              email: response.data.user.email ?? 'email',
              first_name: response.data.user.givenName,
              last_name: response.data.user.familyName,
            };
            const det: registerStoreType = {
              registerData: payload,
              step: 2,
              method: 'provider',
            };
            authStore.setRegisterData(det);
            GoogleSignin.signOut();
            navigate('SignUpStep2', {params: payload});
          }
        } else {
          showLoading(true);
          loginWithSSO.mutate(
            {
              device_token: token,
              provider: 'google',
              token: gToken ?? '',
            },
            {
              onSuccess: (val: apiType) => {
                showLoading(false);
                if (val.status) {
                  navigation.replace('App');
                } else {
                  Toast.show({
                    type: 'error',
                    text1: 'Login',
                    text2: val.message,
                  });
                  GoogleSignin.signOut();
                }
              },
              onError: (e: any) => {
                showLoading(false);
                if (e.status === 401) {
                  Toast.show({
                    type: 'error',
                    text1: 'Login',
                    text2: 'Invalid Credentials',
                  });
                } else {
                  Toast.show({
                    type: 'error',
                    text1: 'Login',
                    text2: 'An error occurred, please try again',
                  });
                }
              },
            },
          );
        }
      } else {
        // sign in was cancelled by user
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        Alert.alert(`Irregular: ${error.name}`, error.message);
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            Alert.alert(error.name, error.message);
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            Alert.alert(error.name, error.message);
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
        // @ts-ignore
        Alert.alert('Error', error);
      }
    }
  }, [data, navigation, showLoading, type]);

  const signInApple = useCallback(async () => {
    const token = await messaging().getToken();
    try {
      const isSupported = appleAuth.isSupported;
      if (isSupported) {
        const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          // Note: it appears putting FULL_NAME first is important, see issue #293
          requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });

        // get current authentication state for user
        // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
        const credentialState = await appleAuth.getCredentialStateForUser(
          appleAuthRequestResponse.user,
        );

        // use credentialState response to ensure the user is authenticated
        if (credentialState === appleAuth.State.AUTHORIZED) {
          // user is authenticated
          showLoading(true);
          if (type === 'login') {
            loginWithSSO.mutate(
              {
                device_token: token,
                provider: 'apple',
                token: appleAuthRequestResponse.authorizationCode ?? '',
              },
              {
                onSuccess: (val: apiType) => {
                  showLoading(false);
                  if (val.status) {
                    navigation.navigate('Splashscreen');
                  }
                },
                onError: (e: any) => {
                  showLoading(false);
                  if (e.status === 401) {
                    Toast.show({
                      type: 'error',
                      text1: 'Login',
                      text2: 'Invalid Credentials',
                    });
                  } else {
                    Toast.show({
                      type: 'error',
                      text1: 'Login',
                      text2: 'An error occurred, please try again',
                    });
                  }
                },
              },
            );
          } else {
            const payload = {
              provider: 'apple',
              token: appleAuthRequestResponse.authorizationCode,
              email: appleAuthRequestResponse.email ?? 'email',
              first_name: appleAuthRequestResponse.fullName?.givenName,
              last_name: appleAuthRequestResponse.fullName?.familyName,
            };
            const det: registerStoreType = {
              registerData: payload,
              step: 2,
              method: 'provider',
            };
            authStore.setRegisterData(det);
            navigate('SignUpStep2', {params: payload});
          }
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login',
          text2: 'Apple Auth not supported for this device',
        });
      }
    } catch (e) {
}
  }, [data, navigation, showLoading, type]);

  const signInAppleAndroid = useCallback(async () => {
    try {
      const isSupported = appleAuthAndroid.isSupported;
      if (isSupported) {
        const token = await messaging().getToken();

        appleAuthAndroid.configure({
          clientId: 'com.fastfastapp',
          redirectUri: 'https://shop.fastfastapp.com/signin/apple',
          responseType: appleAuthAndroid.ResponseType.ALL,
          scope: appleAuthAndroid.Scope.ALL,
          // nonce: rawNonce,
          // state: state,
        });

        const response = await appleAuthAndroid.signIn();
        loginWithSSO.mutate(
          {
            device_token: token,
            provider: 'apple',
            token: response.id_token ?? '',
          },
          {
            onSuccess: (val: apiType) => {
              showLoading(false);
              if (val.status) {
                navigation.navigate('Splashscreen');
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Login',
                  text2: val.message,
                });
                GoogleSignin.signOut();
              }
            },
            onError: (e: any) => {
              showLoading(false);
              if (e.status === 401) {
                Toast.show({
                  type: 'error',
                  text1: 'Login',
                  text2: 'Invalid Credentials',
                });
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Login',
                  text2: 'An error occurred please try again.',
                });
              }
            },
          },
        );
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login',
          text2: 'Apple Auth not supported for this device',
        });
      }
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Login',
        text2: 'An error occurred.',
      });
    }
  }, [navigation, showLoading]);

  const Apple = useCallback(
    () => (
      <Button
        leftIcon={<AppleIcon />}
        onPress={Platform.OS === 'ios' ? signInApple : signInAppleAndroid}
        bg="white"
        borderWidth={1}
        borderColor="#F1F3F4"
        px={3}
        py={4}
        _text={{fontWeight: 'bold', color: 'black', ml: 2}}
        rounded="full">
        Continue with Apple
      </Button>
    ),
    [signInApple, signInAppleAndroid],
  );
  const Google = useCallback(
    () => (
      <Button
        leftIcon={<GoogleIcon />}
        bg="white"
        borderWidth={1}
        borderColor="#F1F3F4"
        px={3}
        py={4}
        onPress={signInGoogle}
        _text={{fontWeight: 'bold', color: 'black', ml: 2}}
        rounded="full">
        Continue with Google
      </Button>
    ),
    [signInGoogle],
  );

  return (
    <VStack space={2} mb={8}>
       {Platform.OS === 'ios' && <Apple />}
      <Google />
    </VStack>
  );
};
