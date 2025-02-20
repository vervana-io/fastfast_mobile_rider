import {formatter} from './formatter';
import {showMessage} from 'react-native-flash-message';

export const functions = {
  filterGeoData(code: string, data: any) {
    const res: any =
      data && data.filter((el: any) => el.types.includes(code))[0];
    return res;
  },
  areLocationsApproximatelySame(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    thresholdInMeters: number = 100,
  ): boolean {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    return distance <= thresholdInMeters;
  },
};
