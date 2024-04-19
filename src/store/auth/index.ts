import {
  clearPersistedStore,
  configurePersistable,
  getPersistedStore,
  makePersistable,
  stopPersisting,
} from 'mobx-persist-store';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthType} from '@types/authType';
import NavigationService from '@navigation/NavigationService';
import {makeAutoObservable} from 'mobx';
import {rootConfig} from '../root';

class AuthStore {
  auth: Partial<AuthType> = {};
  email: string = '';
  isLoggedIn = false;
  lockPassCode: string = '';
  deviceLocked: boolean = false;
  fcmToken: string = '';
  lastActivetime: number = 0;

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
      name: 'authStore',
      properties: [
        'auth',
        'lockPassCode',
        'isLoggedIn',
        'deviceLocked',
        'email',
        'fcmToken',
      ],
    });
  }

  setAuth(auth: AuthType) {
    this.auth = auth;
    this.isLoggedIn = true;
    this.email = auth.user.email;
  }

  setFcmToken(val: string) {
    this.fcmToken = val;
  }

  setAppLock(val: boolean) {
    this.deviceLocked = val;
    return true;
  }

  setLastActiveTime(val: number) {
    console.log('storing last active time ', val);
    this.lastActivetime = val;
  }

  setPasscode(val: string) {
    this.lockPassCode = val;
  }

  async logout() {
    this.auth = {};
    this.isLoggedIn = false;
    this.lockPassCode = '';
    this.deviceLocked = false;
    return new Promise<any>((resolve: any) => {
      NavigationService.navigate('Splashscreen');
      resolve(true);
    });
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

export const authStore = new AuthStore();
