import React from 'react';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import {appButtonStyles} from './styles';

const AppButton = ({
  onPress,
  bg,
  text,
  loading,
  flex = 1,
}: {
  onPress: () => void;
  text: string;
  bg: string;
  loading?: boolean;
  flex?: number;
}) => {
  const styles = appButtonStyles({bg, flex});
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={{color: 'white'}}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;
