import {
  clearPersistedStore,
  configurePersistable,
  getPersistedStore,
  makePersistable,
  stopPersisting,
} from 'mobx-persist-store';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {TransactionsType} from '@types/transactionsType';
import {makeAutoObservable} from 'mobx';

class TransactionsStore {
  transactions: TransactionsType[] = [];

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
      name: 'transactionsStore',
      properties: ['transactions'],
    });
  }

  setTransactions(val: TransactionsType) {
    this.transactions = val;
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

export const transactionsStore = new TransactionsStore();
