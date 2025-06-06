import {StyleSheet} from 'react-native';
import {new_colors} from '../../../new-colors';
import {wp} from '../../../new-resources/config';

export const appMapRedirectStyles = StyleSheet.create({
  container: {
    height: wp(50),
    width: wp(50),
    borderRadius: wp(50),
    backgroundColor: new_colors.primary,
    position: 'absolute',
    right: wp(10),
    bottom: wp(400),
    zIndex: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
