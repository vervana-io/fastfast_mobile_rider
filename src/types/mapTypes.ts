import {GeoCoordinates} from 'react-native-geolocation-service';

export interface markersType {
  id?: string;
  title: string;
  latitude: number;
  longitude: number;
}

export interface MapTypes {
  coords?: GeoCoordinates | null;
  markers?: markersType[];
  riderPosition?: any;
}
