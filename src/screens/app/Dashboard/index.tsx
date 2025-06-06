import AppDrawerToggle from '@components/new-components/app-drawer-toggle';
import AppMapRedirect from '@components/new-components/app-map-redirect';
import NewMap from '@components/new-components/new-map';
import React from 'react';
import {View} from 'react-native';
import PendingControl from './common/pending-control';
import {useDashboard} from './hooks/use-dashboard';

const Dashboard = () => {
  const {handleAcceptOrder, loading, currentSelectedOrder} = useDashboard();

  const chooseBottomControl = () => {
    if (!currentSelectedOrder) return <></>;

    const request_id = currentSelectedOrder?.misc_rider_info?.id || 0;
    const order_id = currentSelectedOrder?.misc_rider_info?.order_id || 0;

    switch (currentSelectedOrder?.status_name) {
      case 'pending':
        return (
          <PendingControl
            pointOne={currentSelectedOrder?.address?.street}
            pointTwo={currentSelectedOrder?.delivery_address}
            request_id={request_id}
            order_id={order_id}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <View style={{flex: 1}}>
      {/* //rebuid your own map component. */}
      <NewMap />
      <AppDrawerToggle />
      <AppMapRedirect
        destinationLat={currentSelectedOrder?.delivery_latitude || 0}
        destinationLng={currentSelectedOrder?.delivery_longitude || 0}
      />
      {chooseBottomControl()}
    </View>
  );
};

export default Dashboard;
