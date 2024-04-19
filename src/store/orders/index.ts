import {
  configurePersistable,
  getPersistedStore,
  makePersistable,
  stopPersisting,
} from 'mobx-persist-store';
import {orderType, orderTypes} from '@types/orderTypes';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Notification} from '@notifee/react-native';
import {makeAutoObservable} from 'mobx';

class OrdersStore {
  notifiedOrder: Notification = {};
  orders: orderTypes[] = [];
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

  setNotifiedOrder(val: Notification) {
    this.notifiedOrder = val;
  }

  setOrders(val: orderTypes[], count: number) {
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

  stopStore() {
    stopPersisting(this);
  }
}

export const ordersStore = new OrdersStore();
