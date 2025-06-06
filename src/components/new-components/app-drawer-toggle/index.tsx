import {useNavigation} from '@react-navigation/native';
import {HamburgerIcon} from 'native-base';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {appDrawerToggleStyles} from './styles';

const AppDrawerToggle = () => {
  const navigation: any = useNavigation();
  const styles = appDrawerToggleStyles;
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation?.openDrawer()}>
      <HamburgerIcon color="themeLight.primary.base" size={6} />
    </TouchableOpacity>
  );
};

export default AppDrawerToggle;
