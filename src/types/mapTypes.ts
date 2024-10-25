import {GeoCoordinates} from 'react-native-geolocation-service';

export interface markersType {
  id?: string;
  title?: string;
  latitude: number;
  longitude: number;
  userType?: 'rider' | 'customer' | 'seller';
}

export interface MapTypes {
  coords?: GeoCoordinates | null;
  markers?: markersType[];
  riderPosition?: any;
}
