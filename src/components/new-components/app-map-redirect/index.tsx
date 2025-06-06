import {MapIcon} from '@assets/svg/MapIcon';
import {openGoogleMapsDirections} from '@helpers/openGoogleMapsDirections';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {appMapRedirectStyles} from './styles';

const AppMapRedirect = ({
  destinationLat,
  destinationLng,
}: {
  destinationLat: number;
  destinationLng: number;
}) => {
  const styles = appMapRedirectStyles;
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        openGoogleMapsDirections({
          destinationLat,
          destinationLng,
        })
      }>
      <MapIcon />
    </TouchableOpacity>
  );
};

export default AppMapRedirect;
