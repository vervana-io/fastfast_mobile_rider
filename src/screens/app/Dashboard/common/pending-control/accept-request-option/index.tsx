import {MapIcon} from '@assets/svg/MapIcon';
import AppButton from '@components/new-components/app-button';
import AppDisplayOrderDetails from '@components/new-components/app-display-order-details';
import AppRow from '@components/new-components/app-row';
import AppSheet from '@components/new-components/app-sheet';
import {useSheet} from '@hooks/useSheet';
import {useAcceptOrder} from '@screens/app/Dashboard/hooks/use-accept-order';
import React from 'react';
import {Text, View} from 'react-native';
import {new_colors} from '../../../../../../new-colors';
import {wp} from '../../../../../../new-resources/config';
import {useAppSelector} from '../../../../../../redux/store';
import {acceptRequestStyles} from './styles';

const AcceptRequestOption = ({}: {request_id: number; order_id: number}) => {
  const {handleAcceptOrder, loading} = useAcceptOrder();
  const {currentSelectedOrder} = useAppSelector(state => state.orderReducer);
  const {openSheet, sheetRef} = useSheet();
  const styles = acceptRequestStyles;

  return (
    <>
      <AppButton onPress={openSheet} text="Accept" bg={new_colors?.accent} />
      <AppSheet adjustToContentHeight closeOnOverlayTap sheetRef={sheetRef}>
        <View style={styles.container}>
          <View style={{gap: wp(20)}}>
            <AppRow>
              <Text style={{color: 'white', fontSize: 30}}>Kings of Wings</Text>
              <AppRow columnGap={50}>
                <AppDisplayOrderDetails />
                <MapIcon />
              </AppRow>
            </AppRow>
            <Text style={{color: 'grey', fontSize: 16}}>
              ILUPEJU BUS-STOP, IKEJA, LAGOS
            </Text>
          </View>
          <View style={{gap: wp(20)}}>
            <Text style={{color: 'white', fontSize: 16}}>
              Note from business
            </Text>
            <Text style={{color: 'grey', fontSize: 16}}>
              Lorem ipsum dolor sit amet consectetur. Donec sit amet eget
              aliquet commodo ultrices sollicitudin. Tempus enim id sagittis
              tempor commodo. Netus adipiscing potenti tortor ornare odio
              pharetra urna viverra. Aenean id odio amet quam velit lacus sit
              tortor.
            </Text>
            <AppButton
              onPress={() =>
                handleAcceptOrder({
                  order_id:
                    currentSelectedOrder?.misc_rider_info?.order_id || 0,
                  request_id: currentSelectedOrder?.misc_rider_info?.id || 0,
                })
              }
              text="I have arrived"
              bg={new_colors?.accent}
              flex={0}
              loading={loading}
            />
          </View>
        </View>
      </AppSheet>
    </>
  );
};

export default AcceptRequestOption;
