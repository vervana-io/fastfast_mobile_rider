import React from 'react';
import {Text, View} from 'react-native';
import {wp} from '../../../new-resources/config';
import {locationPreviewStyles} from './styles';

const LocationPreview = ({
  pointOne,
  pointTwo,
}: {
  pointOne: string;
  pointTwo: string;
}) => {
  const styles = locationPreviewStyles;
  return (
    <View style={{gap: wp(20)}}>
      <Text style={styles.text}>{pointOne}</Text>
      <Text style={styles.text}>{pointTwo}</Text>
    </View>
  );
};

export default LocationPreview;
