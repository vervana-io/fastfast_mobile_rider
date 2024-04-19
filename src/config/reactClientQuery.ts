import {AppState, AppStateStatus} from 'react-native';
import {QueryClient, focusManager, onlineManager, setLogger} from 'react-query';

import NetInfo from '@react-native-community/netinfo';

onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    setOnline(Boolean(state.isConnected));
  });
});

setLogger({
  log: message => {
    console.log('REACT_QUERY:', message);
  },
  warn: message => {
    console.warn(message);
  },
  error: error => {
    console.log('REACT_QUERY', error);
  },
});

focusManager.setEventListener((handleFocus: (arg0: boolean) => void) => {
  const handleAppState = (state: AppStateStatus) => {
    if (state === 'active') {
      handleFocus(true);
    } else if (state === 'background') {
      handleFocus(false);
    } else {
      handleFocus(false);
    }
  };
  AppState.addEventListener('change', handleAppState);

  return () => {
    AppState.removeEventListener('change', handleAppState);
  };
});

export const rootClientQuery = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      cacheTime: 0, // 3000
      retry: 1,
    },
  },
});
