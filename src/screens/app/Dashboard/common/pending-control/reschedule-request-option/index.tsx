import AppButton from '@components/new-components/app-button';
import AppSheet from '@components/new-components/app-sheet';
import {useSheet} from '@hooks/useSheet';
import {useRejectOrder} from '@screens/app/Dashboard/hooks/use-decline-order';
import React from 'react';
import {Text, View} from 'react-native';
import {new_colors} from '../../../../../../new-colors';
import {useAppSelector} from '../../../../../../redux/store';
import {acceptRequestStyles} from './styles';

const RescheduleRequestOption = ({}: {
  request_id: number;
  order_id: number;
}) => {
  const {handleRejectOrder, loading} = useRejectOrder();
  const {currentSelectedOrder} = useAppSelector(state => state.orderReducer);

  const {openSheet, sheetRef} = useSheet();
  const styles = acceptRequestStyles;

  return (
    <>
      <AppButton onPress={openSheet} text="Reassign" bg={new_colors?.dark} />
      <AppSheet adjustToContentHeight closeOnOverlayTap sheetRef={sheetRef}>
        <View style={styles.container}>
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
              onPress={() =>
                handleRejectOrder({
                  order_id:
                    currentSelectedOrder?.misc_rider_info?.order_id || 0,
                  request_id: currentSelectedOrder?.misc_rider_info?.id || 0,
                })
              }
              text="Reschedule Order"
              bg={new_colors?.accent}
              loading={loading}
            />
          </>
        </View>
      </AppSheet>
    </>
  );
};

export default RescheduleRequestOption;
