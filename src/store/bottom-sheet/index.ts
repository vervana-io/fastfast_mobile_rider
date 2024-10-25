import {
  clearPersistedStore,
  configurePersistable,
  getPersistedStore,
  makePersistable,
  stopPersisting,
} from 'mobx-persist-store';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {makeAutoObservable} from 'mobx';

export type AppSheets = {
  profileViewSheet?: boolean;
  orderDetailsView?: boolean;
};

interface sheetContentDataType {
  title?: string;
  description?: string;
  content?: any;
  payload?: any;
}

class BottomSheetStore {
  sheets: Partial<AppSheets> = {};
  sheetContentData: Partial<sheetContentDataType> = {};

  constructor() {
    makeAutoObservable(this);
    configurePersistable(
      {
        storage: AsyncStorage,
        expireIn: 0,
        removeOnExpiration: true,
        stringify: true,
        debugMode: false,
      },
      {delay: 200, fireImmediately: false},
    );
    makePersistable(this, {
      name: 'bottomSheetStore',
      properties: [],
    });
  }

  SetSheet(
    tab: keyof AppSheets,
    val: boolean,
    contentData?: sheetContentDataType,
  ) {
    this.sheets[tab] = val;
    if (contentData) {
      this.sheetContentData = contentData;
    }
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

export const bottomSheetStore = new BottomSheetStore();
