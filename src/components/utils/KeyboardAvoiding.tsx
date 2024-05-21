import {
  Keyboard,
  KeyboardAvoidingViewProps,
  Platform,
  RefreshControl,
} from 'react-native';
/* eslint-disable react-native/no-inline-styles */
import {KeyboardAvoidingView, ScrollView} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';

interface KeyboardAvoidingProps {
  children?: any;
  refreshing?: boolean;
  shouldRefresh?: any;
  paddingBottom?: number;
  refreshable?: boolean;
}

export const KeyboardAvoiding = (props: KeyboardAvoidingProps) => {
  const {
    children,
    refreshing = false,
    shouldRefresh,
    paddingBottom = 10,
    refreshable = true,
  } = props;
  const [avoidingSet, setAvoidingSet] = useState<
    KeyboardAvoidingViewProps['behavior']
  >(Platform.OS === 'android' ? 'height' : 'padding');

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        Platform.OS === 'android' && setAvoidingSet('height');
      },
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const onRefresh = useCallback(() => {
    if (shouldRefresh) {
      shouldRefresh(true);
    }
  }, [shouldRefresh]);

  return (
    <KeyboardAvoidingView behavior={avoidingSet} style={{flex: 1}}>
      <ScrollView
        _contentContainerStyle={{flexGrow: 1, paddingBottom: paddingBottom}}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled
        refreshControl={
          refreshable ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
