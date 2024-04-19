import {
  clearPersistedStore,
  configurePersistable,
  getPersistedStore,
  makePersistable,
  stopPersisting,
} from 'mobx-persist-store';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {authStore} from '../auth/index';
import {makeAutoObservable} from 'mobx';

export interface checklistProps {
  id: number;
  title: string;
  completionTime: string;
  completed: number;
  isActive: boolean;
  nav: {
    name: string;
  };
  status: number;
}

class Checklist {
  checklist: checklistProps[] = [
    {
      id: 1,
      title: 'Vehicle verification',
      completionTime: '10s',
      completed: 0,
      isActive: true,
      nav: {
        name: 'Overlays',
      },
      status: 0,
    },
    {
      id: 2,
      title: 'Personal identity',
      completionTime: '10s',
      completed: 0,
      isActive: true,
      nav: {
        name: 'Settings',
      },
      status: 0,
    },
    {
      id: 3,
      title: 'Guarantor form',
      completionTime: '1m.30s',
      completed: 0,
      isActive: true,
      nav: {
        name: 'AccountVerification',
      },
      status: 0,
    },
    {
      id: 4,
      title: 'Working hours',
      completionTime: '10s',
      completed: 0,
      isActive: true,
      nav: {
        name: 'Auth',
      },
      status: 0,
    },
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

  disableChecklistById(id: number) {
    const list = this.checklist;
    const index = list.findIndex(fill => fill.id === id);
    if (index >= 0 && index < list.length) {
      list[index].isActive = false;
      return true;
    }
    return false;
  }

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
