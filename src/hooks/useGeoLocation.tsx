import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import {useMutation, useQuery} from 'react-query';

import {Double} from 'react-native/Libraries/Types/CodegenTypes';
import {http} from '../config';
import {useState} from 'react';

export type geoConfig = {
  enableFetchLocation?: boolean;
};

export const useGeolocation = (config?: geoConfig) => {
  const [location, setLocation] = useState<GeoPosition | null>(null);

  const geoCode = useMutation(async (data: {lat: Double; lng: Double}) => {
    try {
      const req: any = await http.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${data.lat},${data.lng}&key=${process.env.GOOGLE_API_KEY}`,
        {isGeneric: true},
      );
      return req.data;
    } catch (error) {
      throw error;
    }
  });

  const GeoLocate = useQuery(
    ['GeoLocate'],
    async () => {
      Geolocation.getCurrentPosition(
        position => {
          setLocation(position);
          // console.log(position);
        },
        error => {
          // Alert.alert(`Code ${error.code}`, error.message);
          setLocation(null);
          // console.log(error);
        },
        {
          accuracy: {
            android: 'high',
            ios: 'best',
          },
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 0,
          forceRequestLocation: true,
          forceLocationManager: true,
          showLocationDialog: true,
        },
      );
    },
    {
      enabled: Boolean(config?.enableFetchLocation),
    },
  );

  return {
    geoCode,
    location,
    GeoLocate,
  };
};
