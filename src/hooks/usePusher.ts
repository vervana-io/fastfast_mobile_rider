import {Pusher, PusherEvent} from '@pusher/pusher-websocket-react-native';
import {useCallback, useEffect} from 'react';

interface PusherHookReturn {
  subscribe: (channelName: string, callback: (data: any) => void) => void;
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

export const UsePusher = (): PusherHookReturn => {
  const pusherEvent = PusherEvent;
  useEffect(() => {
    const initialize = async () => {
      await pusher.init({
        apiKey: PusherInstance.appKey ?? '',
        cluster: PusherInstance.cluster ?? '',
      });
      await pusher.connect();
    };

    initialize();
  }, []);

  const subscribe = useCallback(
    async (channelName: string, callback: (data: any) => void) => {
      if (pusher) {
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
        });
      }
    },
    [],
  );

  return {
    subscribe,
    pusherEvent,
  };
};
