import LocationPreview from '@components/new-components/app-location-preview';
import AppRow from '@components/new-components/app-row';
import NewControlWrapper from '@components/new-components/new-control-wrapper';
import React from 'react';
import {Text} from 'react-native';
import AcceptRequestOption from './accept-request-option';
import RescheduleRequestOption from './reschedule-request-option';

const PendingControl = ({
  pointOne,
  pointTwo,
  request_id,
  order_id,
}: {
  pointOne: string;
  pointTwo: string;
  request_id: number;
  order_id: number;
}) => {
  return (
    <NewControlWrapper>
      <>
        <Text style={{color: 'white', fontSize: 30}}>₦2,800.00</Text>
        <AppRow columnGap={16} justifyContent="space-between">
          {/* //SVG goes in here */}
          <Text style={{color: 'white', fontSize: 16}}>4 min (1.6 ml)</Text>
        </AppRow>
        <LocationPreview pointOne={pointOne} pointTwo={pointTwo} />
        <AppRow>
          <AcceptRequestOption order_id={order_id} request_id={request_id} />
          <RescheduleRequestOption
            order_id={order_id}
            request_id={request_id}
          />
        </AppRow>
      </>
    </NewControlWrapper>
  );
};

export default PendingControl;
