import {
  clearPersistedStore,
  configurePersistable,
  getPersistedStore,
  makePersistable,
  stopPersisting,
} from 'mobx-persist-store';
import {notificationsType, orderType} from '@types/orderTypes';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Notification} from '@notifee/react-native';
import {makeAutoObservable} from 'mobx';

class OrdersStore {
  notifiedOrder: Partial<notificationsType> = {};
  orders: orderType[] = [];
  ongoingOrderCount: number = 0;
  selectedOrderId: number = 0;
  selectedOrder: Partial<orderType> = {};

  constructor() {
    makeAutoObservable(this);
    configurePersistable(
      {
        storage: AsyncStorage,
        expireIn: 31212112640,
        removeOnExpiration: true,
        stringify: true,
        debugMode: false,
      },
      {delay: 200, fireImmediately: false},
    );
    makePersistable(this, {
      name: 'ordersStore',
      properties: ['orders', 'ongoingOrderCount'],
    });
  }

  setNotifiedOrder(val: notificationsType) {
    this.notifiedOrder = val;
  }

  setOrders(val: orderType[], count: number) {
    this.orders = val;
    this.ongoingOrderCount = count;
  }

  clearNotifiedOrder() {
    this.notifiedOrder = {};
  }

  setSelectedOrderId(id: number) {
    this.selectedOrderId = id;
  }

  setSelectedOrder(val: orderType) {
    this.selectedOrder = val;
  }

  async getStoredData() {
    return await getPersistedStore(this);
  }

  async clearPersisting() {
    return await clearPersistedStore(this);
  }

  stopStore() {
    stopPersisting(this);
  }
}

export const ordersStore = new OrdersStore();
