import {playEffectForNotifications} from '@handlers/playEffect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {notificationsType, orderType} from '@types/orderTypes';
import {makeAutoObservable} from 'mobx';
import {
  clearPersistedStore,
  configurePersistable,
  getPersistedStore,
  makePersistable,
  stopPersisting,
} from 'mobx-persist-store';

interface hasArrivedType {
  order_id: number;
  has_arrived: boolean;
}

class OrdersStore {
  notifiedOrder: Partial<notificationsType> = {};
  orders: orderType[] = [];
  ongoingOrderCount: number = 0;
  selectedOrderId: number = 0;
  selectedOrder: Partial<orderType> = {};
  tempHasArrived: hasArrivedType = {
    order_id: 0,
    has_arrived: false,
  };

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
      properties: ['orders', 'ongoingOrderCount', 'tempHasArrived'],
    });
  }

  setNotifiedOrder(val: notificationsType) {
    console.log('=================order===================');
    console.log(val);
    console.log('====================================');

    // check for duplicate request
    if (val.request_id && this.notifiedOrder.request_id) {
      if (val.request_id === this.notifiedOrder.request_id) {
        return;
      }
    }
    console.log(this.ongoingOrderCount, 'this.ongoingOrderCount');
    if (this.ongoingOrderCount < 20) {
      playEffectForNotifications();
      this.notifiedOrder = val;
    } else {
      playEffectForNotifications();
      this.notifiedOrder = val;
    }
  }

  setArrival(val: hasArrivedType) {
    this.tempHasArrived = val;
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
