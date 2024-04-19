import {
  clearPersistedStore,
  configurePersistable,
  getPersistedStore,
  makePersistable,
  stopPersisting,
} from 'mobx-persist-store';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {makeAutoObservable} from 'mobx';
import {userAddresses} from '@types/userTypes';

class AddressesStore {
  addresses: userAddresses[] = [];
  selectedAddress: Partial<userAddresses> = {};

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
      name: 'addressesStore',
      properties: ['addresses', 'selectedAddress'],
    });
  }

  setAddresses(val: userAddresses[]) {
    this.addresses = val;
    val.map(el => {
      if (el.is_primary === 1) {
        this.selectedAddress = el;
      }
    });
  }

  setSelectedAddresses(val: userAddresses) {
    this.selectedAddress = val;
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

export const addressesStore = new AddressesStore();
