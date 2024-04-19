import {formatter} from './formatter';
import {showMessage} from 'react-native-flash-message';

export const functions = {
  filterGeoData(code: string, data: any) {
    const res: any =
      data && data.filter((el: any) => el.types.includes(code))[0];
    return res;
  },
};
