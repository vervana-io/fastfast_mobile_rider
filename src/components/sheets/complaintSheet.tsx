/* eslint-disable react-native/no-inline-styles */
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import {Alerts, AlertsProps, SheetHeader} from '@components/ui';
import {Box, Button, Text, TextArea, VStack} from 'native-base';
import React, {useCallback, useRef, useState} from 'react';

import {ListType} from './orderHelp';
import {WIN_HEIGHT} from '../../config';
import {apiType} from '@types/index';
import {observer} from 'mobx-react-lite';
import {useOrders} from '@hooks/useOrders';

export const ComplaintSheet = observer((props: SheetProps) => {
  const complaintSheetRef = useRef<ActionSheetRef>(null);
  const [issue, setIssue] = useState('');
  const [errors, setErrors] = useState<{
    type: AlertsProps['status'];
    message: any;
  }>();

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
            setErrors({
              type: 'success',
              message: 'Your complaint has been logged',
            });
            setTimeout(() => {
              SheetManager.hide('ComplaintSheet');
            }, 1000);
          } else {
            setErrors({
              type: 'warning',
              message: val.message,
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
    </ActionSheet>
  );
});
