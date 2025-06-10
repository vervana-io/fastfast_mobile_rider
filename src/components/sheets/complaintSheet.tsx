/* eslint-disable react-native/no-inline-styles */
import {
  Alerts,
  AlertsProps,
  CancelOrderModal,
  SheetHeader,
} from '@components/ui';
import {Box, Button, Text, TextArea, VStack} from 'native-base';
import React, {useCallback, useRef, useState} from 'react';
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';

import {useOrders} from '@hooks/useOrders';
import {bottomSheetStore} from '@store/bottom-sheet';
import {ordersStore} from '@store/orders';
import {apiType} from '@types/index';
import {observer} from 'mobx-react-lite';
import Toast from 'react-native-toast-message';
import {WIN_HEIGHT} from '../../config';
import {ListType} from './orderHelp';

export const ComplaintSheet = observer((props: SheetProps) => {
  const complaintSheetRef = useRef<ActionSheetRef>(null);
  const [issue, setIssue] = useState('');
  const [errors, setErrors] = useState<{
    type: AlertsProps['status'];
    message: any;
  }>();
  const [showCancelOrder, setShowCancelOrder] = useState(false);

  const {complaints} = useOrders();

  const data: ListType = props.payload;

  const doComplaint = () => {
    complaints.mutate(
      {
        title: data.title,
        body: issue,
      },
      {
        onSuccess: (val: apiType) => {
          if (val.status) {
            Toast.show({
              type: 'success',
              text1: 'Complaint',
              text2:
                'Your complaint has been logged successfully and an admin would reach you',
            });
            setTimeout(() => {
              SheetManager.hide('ComplaintSheet');
              setShowCancelOrder(true);
            }, 1000);
            if (data.title === 'Reassignment') {
              ordersStore.clearNotifiedOrder();
              ordersStore.setSelectedOrder({});
              ordersStore.setSelectedOrderId(0);
              bottomSheetStore.SetSheet('orderDetailsView', false);
            }
          } else {
            Toast.show({
              type: 'error',
              text1: 'Complaint',
              text2: 'We could not log your complaint',
            });
          }
        },
        onError: () => {
          setErrors({
            type: 'error',
            message: 'An error occurred',
          });
        },
      },
    );
  };

  const Content = useCallback(() => {
    return (
      <Box py={6} px={4} bg="#fff" h="full" roundedTop="2xl">
        <SheetHeader sheetToClose="ComplaintSheet" title={data.title} />
        {errors?.message && (
          <Alerts
            status={errors.type}
            title={errors.message}
            variant="outline"
          />
        )}
        <VStack w="full" space={8} mt={8}>
          <Text fontWeight="semibold">Tell us what the problem is</Text>
          <TextArea
            placeholder="Tell us what the problem is and how we can help"
            onChangeText={e => setIssue(e)}
            autoCompleteType={undefined}
            value={issue}
          />
          <Button
            onPress={doComplaint}
            w="full"
            isLoading={complaints.isLoading}
            isLoadingText="Logging complaint"
            _text={{fontWeight: 'bold'}}
            rounded="full">
            Submit
          </Button>
        </VStack>
      </Box>
    );
  }, [complaints.isLoading, data?.title, errors?.message, errors?.type, issue]);

  return (
    <ActionSheet
      id={props.sheetId}
      ref={complaintSheetRef}
      indicatorStyle={{
        width: 0,
      }}
      gestureEnabled={true}
      containerStyle={{
        height: WIN_HEIGHT * 0.9,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: 'white',
        // backgroundColor: colorMode === 'dark' ? '#111827' : '#fff',
      }}>
      {Content()}
      <Toast />
      <CancelOrderModal
        show={showCancelOrder}
        order_id={ordersStore.selectedOrder?.id ?? 0}
      />
    </ActionSheet>
  );
});
