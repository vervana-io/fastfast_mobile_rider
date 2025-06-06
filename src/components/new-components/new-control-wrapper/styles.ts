import {StyleSheet} from 'react-native';
import {new_colors} from '../../../new-colors';
import {wp} from '../../../new-resources/config';
import {AlignTypes} from '../../../new-types/styles';

export const newControlWrapperStyles = ({
  alignItems,
}: {
  alignItems: AlignTypes;
}) =>
  StyleSheet.create({
    wrapper: {
      padding: wp(20),
      bottom: 0,
      left: 0,
      right: 0,
      position: 'absolute',
    },
    container: {
      padding: wp(32),
      width: '100%',
      backgroundColor: new_colors?.primary,
      gap: wp(20),
      justifyContent: 'center',
      alignItems,
      borderRadius: wp(16),
    },
  });
