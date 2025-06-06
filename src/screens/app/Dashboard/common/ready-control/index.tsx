import AppButton from '@components/new-components/app-button';
import NewControlWrapper from '@components/new-components/new-control-wrapper';
import React from 'react';
import {Text} from 'react-native';
import {new_colors} from '../../../../../new-colors';

//TODO: Add reschedule order functionality
//TODO: Extract the Text components into a separate component
const ReadyControl = ({
  onPressReschedule,
  loading,
}: {
  onPressReschedule: () => void;
  loading: boolean;
}) => {
  return (
    <NewControlWrapper>
      <>
        <Text style={{color: 'white', fontSize: 30, alignSelf: 'center'}}>
          😢
        </Text>
        <Text style={{color: 'white', fontSize: 28, textAlign: 'center'}}>
          Reschedule this order?
        </Text>
        <Text style={{color: 'white', fontSize: 16, textAlign: 'center'}}>
          If you can’t deliver this order, you can reschedule it.
        </Text>

        <AppButton
          onPress={onPressReschedule}
          text="Reschedule order"
          bg={new_colors?.accent}
          loading={loading}
        />
      </>
    </NewControlWrapper>
  );
};

export default ReadyControl;
