import {Pusher, PusherEvent} from '@pusher/pusher-websocket-react-native';

export const pusher = Pusher.getInstance();

export const initializePusher = async () => {
  try {
    await pusher.init({
      apiKey: 'a17efd9178239931654c',
      cluster: 'mt1',
    });

    await pusher.connect();

    console.log('Registered Successfully');
  } catch (e) {
    console.log(`ERROR: Failed to register because ---> ${e}`);
  }
};

export const subscribeToEvent = async (
  callback: (event: PusherEvent) => void,
) => {
  // Bind the event to the channel
  await pusher.subscribe({
    channelName: 'FastFast',
    onEvent: callback,
  });
};

// // Unsubscribe from a specific event on the channel
// export const unsubscribeFromEvent = (eventName: string): void => {
//   if (channel) {
//     channel.unbind(eventName);
//     console.log(`Unsubscribed from event '${eventName}'`);
//   }
// };

// // Cleanup function to disconnect Pusher and unbind all events
// export const disconnectPusher = (): void => {
//   if (channel) {
//     channel.unbind_all();
//     pusher?.unsubscribe(channel.name);
//   }

//   if (pusher) {
//     pusher.disconnect();
//   }
// };
