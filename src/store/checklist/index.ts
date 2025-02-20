import {
  clearPersistedStore,
  configurePersistable,
  getPersistedStore,
  makePersistable,
  stopPersisting,
} from 'mobx-persist-store';
import {makeAutoObservable, runInAction} from 'mobx';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {authStore} from '../auth/index';

export interface checklistProps {
  id: number;
  title: string;
  completionTime: string;
  completed: number;
  isActive: boolean;
  sheetName: string;
  sheetType: '1' | '2'; // type 1 is for normal actions-sheet, 2 is for ghrhon sheet
  status: number;
}

class Checklist {
  checklist: checklistProps[] = [
    {
      id: 1,
      title: 'Verify your identity',
      completionTime: '20s',
      completed: 0,
      isActive: true,
      sheetName: 'verifyIdentitySheet',
      status: 0,
      sheetType: '1',
    },
    {
      id: 2,
      title: 'Guarantor Form',
      completionTime: '1m.5s',
      completed: 0,
      isActive: true,
      sheetName: 'guarantorView',
      sheetType: '2',
      status: 0,
    },
    // {
    //   id: 3,
    //   title: 'Set your default address',
    //   completionTime: '20s',
    //   completed: 0,
    //   isActive: true,
    //   sheetName: 'addressSheetNewIOS',
    //   status: 0,
    // },
  ];

  constructor() {
    makeAutoObservable(this);
    configurePersistable(
      {
        storage: AsyncStorage,
        expireIn: 604800000,
        removeOnExpiration: true,
        stringify: true,
        debugMode: false,
      },
      {delay: 200, fireImmediately: false},
    );
    makePersistable(this, {
      name: 'checklist',
      properties: ['checklist'],
    });
  }

  setCompleted(val: checklistProps, listIndex: number) {
    this.checklist[listIndex] = val;
  }

  updateCompletedByIndex(id: number) {
    const index = this.checklist.findIndex(item => item.id === id);
    if (index !== -1) {
      runInAction(() => {
        this.checklist[index].status = 1;
        this.checklist[index].completed = 1;
      });
    }
  }

  disableChecklistById(id: number) {
    const list = this.checklist;
    const index = list.findIndex(fill => fill.id === id);
    if (index >= 0 && index < list.length) {
      list[index].isActive = false;
      return true;
    }
    return false;
  }

  verifyChecklist() {}

  async getStoredData() {
    return await getPersistedStore(this);
  }

  async clearStoredData() {
    await clearPersistedStore(this);
  }

  stopStore() {
    stopPersisting(this);
  }
}
export const checklist = new Checklist();
