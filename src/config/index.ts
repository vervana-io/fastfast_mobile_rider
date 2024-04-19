import {Dimensions} from 'react-native';
export * from './async';
export * from './http';
export * from './axios';
export * from './reactClientQuery';
const {width, height} = Dimensions.get('window');

export const WIN_WIDTH = width;
export const WIN_HEIGHT = height;
