import {Pusher, PusherEvent} from '@pusher/pusher-websocket-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authStore} from '@store/auth';
import {useCallback, useEffect} from 'react';
import {STORAGE_KEY} from '../constant';
import {apiInstance} from '../config/axios';

interface PusherHookReturn {
  subscribe: (channelName: string, callback: (data: any) => void) => void;
  unsuscribe: (channelName: string) => void;
  pusherEvent: any;
  //   bind: (eventName: string, callback: (data: any) => void) => void;
  //   unsubscribe: (channelName: string) => void;
  //   trigger: (channelName: string, eventName: string, data: any) => void;
}

const PusherInstance = {
  instanceId: process.env.PUSHER_INSTANCE_ID ?? '',
  cluster: process.env.PUSHER_CLUSTER,
  appKey: process.env.PUSHER_API_KEY,
};

const pusher = Pusher.getInstance();
const userD = authStore.auth;

export const usePusher = (): PusherHookReturn => {
  const pusherEvent = PusherEvent;
  useEffect(() => {
    const initialize = async () => {
      await pusher.init({
        authorizerTimeoutInSeconds: 30, // 30sec
        apiKey: PusherInstance.appKey ?? '',
        cluster: PusherInstance.cluster ?? '',
        onAuthorizer: async (channelName: string, socketId: string) => {
          try {
            const token = await AsyncStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
            if (!token) {
              return undefined;
            }

            const response = await apiInstance.post(
              process.env.BASE_URL + 'broadcasting/auth',
              {
                socket_id: socketId,
                channel_name: channelName,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            return response.data;
          } catch (error) {
            console.error('Authorizer error', error);
            return undefined;
          }
        },
      });

      await pusher.connect();
    };

    initialize();
  }, []);

  const subscribe = useCallback(
    async (channelName: string, callback: (data: any) => void) => {
      if (pusher) {
        const Id = userD?.user?.id?.toString() || '';
        channelName = channelName.replace('userId', Id);
        await pusher
          .subscribe({
            channelName: channelName,
            onSubscriptionSucceeded: data => {},
            onMemberAdded: member => {},
            onMemberRemoved: member => {},
            onEvent: (event: PusherEvent) => {
              callback(event);
            },
            onSubscriptionError(channelName, message, e) {
              console.error(`Subscription error: ${channelName}, ${message}`);
            },
          })
          .catch(console.error);
      }
    },
    [],
  );

  const unsuscribe = useCallback(async (channelName: string) => {
    const Id = userD?.user?.id?.toString() || '';
    channelName = channelName.replace('userId', Id);
    pusher.trigger({
      eventName: '',
      channelName: '',
      data: {},
      userId: Id,
    });
    await pusher.unsubscribe({
      channelName,
    });
  }, []);

  return {
    subscribe,
    pusherEvent,
    unsuscribe,
  };
};
