import {StyleSheet} from 'react-native';
import {new_colors} from '../../../new-colors';

export const appButtonStyles = ({bg, flex}: {bg?: string; flex?: number}) =>
  StyleSheet.create({
    container: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      backgroundColor: bg || new_colors?.accent,
      borderRadius: 30,
      alignItems: 'center',
      flex,
    },
  });
