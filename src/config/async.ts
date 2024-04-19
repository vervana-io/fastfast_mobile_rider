import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AsyncStore {
  set = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
      return e;
    }
  };
  setObject = async (key: string, value: string) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      // saving error
      return e;
    }
  };
  get = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // value previously stored
        return value;
      }
    } catch (e) {
      // error reading value
      return e;
    }
  };
  getObject = async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      return e;
    }
  };
  remove = async (key: string) => {
    try {
      const value = await AsyncStorage.removeItem(key);
      return value;
    } catch (e) {
      return e;
    }
  };
  clear = async () => {
    try {
      const value = await AsyncStorage.clear();
      return value;
    } catch (e) {
      return e;
    }
  };
}

const asyncStore = new AsyncStore();
export default asyncStore;
