import {AppState, AppStateStatus} from 'react-native';
import {useEffect, useState} from 'react';

interface AppStateHook {
  isBackground: boolean;
  isForeground: boolean;
  currentAppState: AppStateStatus;
}

export const useAppState = (): AppStateHook => {
  const [currentAppState, setCurrentAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  useEffect(() => {
    // Handler for app state changes
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      setCurrentAppState(nextAppState);
    };

    // Add event listener for app state changes
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Cleanup subscription on component unmount
    return () => {
      subscription.remove();
    };
  }, []);

  // Derive background/foreground states
  const isBackground = currentAppState.match(/inactive|background/);
  const isForeground = currentAppState === 'active';

  return {
    isBackground: !!isBackground,
    isForeground,
    currentAppState,
  };
};
