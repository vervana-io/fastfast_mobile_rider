import {StyleSheet} from 'react-native';
import {wp} from '../../../new-resources/config';

export const appDrawerToggleStyles = StyleSheet.create({
  container: {
    height: wp(50),
    width: wp(50),
    borderRadius: wp(50),
    backgroundColor: 'black',
    position: 'absolute',
    left: 10,
    top: 50,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
