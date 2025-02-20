import {
  configurePersistable,
  getPersistedStore,
  makePersistable,
  stopPersisting,
} from 'mobx-persist-store';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {makeAutoObservable} from 'mobx';

export type CheckerTypes = {
  lockScreen: boolean;
  pinAvailable: boolean;
  customerNames: boolean;
};

class Store {
  AppName: string = 'PurplePay';
  newUser: boolean = true;
  lastActiveTime: string = '';
  biometrics: boolean = false;
  shouldLogin: boolean = false;
  requestLoading: boolean = false;
  isOnline: boolean = false;

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
      name: 'config',
      properties: [
        'newUser',
        'lastActiveTime',
        'biometrics',
        'shouldLogin',
        'isOnline',
      ],
    });
  }

  setLastActiveTime(time: string) {
    this.lastActiveTime = time;
  }

  setBiometrics(val: boolean) {
    this.biometrics = val;
  }

  setRequestLoading(val: boolean) {
    this.requestLoading = val;
  }

  setNewUser(val: boolean) {
    this.newUser = val;
  }

  setIsOnline(val: boolean) {
    this.isOnline = val;
    console.log('online state', val);
  }

  setShouldLogin(val: boolean) {
    console.log('user should log in');
    this.shouldLogin = val;
  }

  async getStoredData() {
    return await getPersistedStore(this);
  }

  stopStore() {
    stopPersisting(this);
  }
}

export const rootConfig = new Store();
