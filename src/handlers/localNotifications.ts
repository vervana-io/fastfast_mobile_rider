import notifee from '@notifee/react-native';

interface channelData {
  id: string;
  name: string;
}

export const createChannel = async (
  id: string = 'default',
  name: string = 'default channel',
) => {
  // Create a channel
  const channelId = await notifee.createChannel({
    id: id,
    name: name,
  });
  return channelId;
};

export const onDisplayNotification = async (
  title: string,
  body: string,
  channelData: channelData,
) => {
  const channelId = await createChannel(channelData.id, channelData.name);
  // Display a notification
  await notifee.displayNotification({
    title: title,
    body: body,
    android: {
      channelId,
    },
  });
};

export const billsNotification = async (message: string) => {
  try {
    const noti = await onDisplayNotification('Bill Payment', message, {
      id: 'Bills',
      name: 'Bills Channel',
    });
    return noti;
  } catch (e) {
    throw e;
  }
};

export const transfersNotification = async (message: string) => {
  try {
    const noti = await onDisplayNotification('💰💰💰💰💰💰', message, {
      id: 'Transfers',
      name: 'Transfers Channel',
    });
    return noti;
  } catch (e) {
    throw e;
  }
};

export const myLocationNotification = async (message: string) => {
  try {
    const noti = await onDisplayNotification('My Location', message, {
      id: 'Location',
      name: 'Location Channel',
    });
    return noti;
  } catch (e) {
    throw e;
  }
};
