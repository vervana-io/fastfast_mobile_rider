import {Pusher, PusherEvent} from '@pusher/pusher-websocket-react-native';
import {authStore} from '@store/auth';
import {useCallback, useEffect} from 'react';
import {STORAGE_KEY} from '../constant';
interface PusherHookReturn {
  subscribe: (channelName: string, callback: (data: any) => void) => void;
  pusherEvent: any;
  unsuscribe: (channelName: string) => void;
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

export const UsePusher = (): PusherHookReturn => {
  const pusherEvent = PusherEvent;
  useEffect(() => {
    const initialize = async () => {
      await pusher.init({
        authorizerTimeoutInSeconds: 30, //30sec
        apiKey: PusherInstance.appKey ?? '',
        cluster: PusherInstance.cluster ?? '',
        onAuthorizer: async (channelName: string, socketId: string) => {
          console.log('calling authorizer', {channelName, socketId});
          try {
            const token = await AsyncStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
            const response = await fetch(
              'https://9ff5-102-219-152-26.ngrok-free.app/api/broadcasting/auth',
              {
                method: 'POST',
                headers: {
                   'Content-Type': 'application/json',
                   Authorization: 'Bearer ' + token,
                 },
                 body: JSON.stringify({
                   socket_id: socketId,
                   channel_name: channelName,
                 }),
               },
             );
             const body = (await response.json()) as PusherAuthorizerResult;
             console.log(JSON.stringify(body, null, 2), ' NEW PUSHER');
             return body;
           } catch (error) {
             console.log(error);
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
        console.log('THERE IS PUSHER');
        const Id = userD?.user?.id?.toString();
        channelName = channelName.replace('userId', Id);
        await pusher.subscribe({
          channelName: channelName,
          onSubscriptionSucceeded: data => {
            console.log(`Subscribed to ${channelName}`);
            console.log(`I can now access me: ${data}`);
          },
          onMemberAdded: member => {
            console.log(`Member added: ${member}`);
          },
          onMemberRemoved: member => {
            console.log(`Member removed: ${member}`);
          },
          onEvent: (event: PusherEvent) => {
            // console.log(`Event received: ${event}`);
            callback(event);

          },
          onSubscriptionError(channelName, message, e) {
            console.error(`Subscription error: ${channelName}, ${message}`);
          },
        });
      }
    },
    [],
  );

  const unsuscribe = useCallback(async (channelName: string) => {

    const Id = userD?.user?.id?.toString();
    channelName = channelName.replace('userId', Id);
    pusher.trigger({
      eventName: '',
      channelName: '',
      data: {},
      userId: id,
    })
    await pusher.unsubscribe({
      channelName,
    });
  }, [])

  return {
    subscribe,
    unsuscribe,
    pusherEvent,
  };
};
