import React, {ReactNode} from 'react';
import {View} from 'react-native';
import {AlignTypes} from '../../../new-types/styles';
import {newControlWrapperStyles} from './styles';

const NewControlWrapper = ({
  children,
  alignItems,
}: {
  children: ReactNode;
  alignItems?: AlignTypes;
}) => {
  const styles = newControlWrapperStyles({alignItems});
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>{children}</View>
    </View>
  );
};

export default NewControlWrapper;
