/* eslint-disable react-native/no-inline-styles */
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
  useScrollHandlers,
} from 'react-native-actions-sheet';
import {Alerts, AlertsProps, SheetHeader} from '@components/ui';
import {
  Box,
  Button,
  ChevronDownIcon,
  HStack,
  Pressable,
  Text,
  VStack,
} from 'native-base';
import React, {useCallback, useRef, useState} from 'react';
import {object, string} from 'yup';

import {Formik} from 'formik';
import {Input} from '@components/inputs';
import {KeyboardAvoiding} from '@components/utils';
import {NativeViewGestureHandler} from 'react-native-gesture-handler';
import {ScrollView} from 'react-native';
import Toast from 'react-native-toast-message';
import {WIN_HEIGHT} from '../../config';
import {apiType} from '@types/apiTypes';
import {checklist} from '@store/checklist';
import {observer} from 'mobx-react-lite';
import {profileUpdateType} from '@types/userTypes';
import {useUser} from '@hooks/useUser';
import {workDurationTypes} from './WorkDurationSheet';

export const GuarantorFormSheet = observer((props: SheetProps) => {
  const guarantorFormSheetRef = useRef<ActionSheetRef>(null);
  const handlers = useScrollHandlers();

  const [workDuration, setWorkDuration] = useState<workDurationTypes>();

  const {profileUpdate, userDetails} = useUser();

  const step2Shema = object({
    first_guarantor_name: string().required('Guarantor name is required'),
    first_guarantor_phone_number: string().required(
      'Guarantor phone is required',
    ),
    second_guarantor_name: string().required(
      'Second Guarantor name is required',
    ),
    second_guarantor_phone_number: string().required(
      'Second Guarantor phone number is required',
    ),
    previous_place_of_work: string().required(
      'Previous Place of work is required',
    ),
    // previous_place_of_work_duration: string().required(
    //   'Previous Work duration is required',
    // ),
  });

  const getSelectedBrand = async () => {
    const _workDuration: workDurationTypes = await SheetManager.show(
      'WorkDurationSheet',
    );
    if (_workDuration) {
      console.log('work duration', _workDuration);
      setWorkDuration(_workDuration);
    }
  };

  const doUpdate = useCallback(
    async (update: profileUpdateType) => {
      console.log('updating...');
      profileUpdate.mutate(update, {
        onSuccess: (val: apiType) => {
          if (val.status) {
            userDetails.refetch();
            SheetManager.hide('GuarantorFormSheet');
            Toast.show({
              type: 'success',
              text1: 'Profile Update',
              text2: 'Guarantor form updated successfully',
            });
          } else {
            Toast.show({
              type: 'error',
              text1: 'Profile Update',
              text2: val.message,
            });
          }
        },
        onError: error => {
          console.error('error', error);
          Toast.show({
            type: 'error',
            text1: 'Profile Update',
            text2: 'An error occurred while updating',
          });
        },
      });
    },
    [profileUpdate],
  );

  const Content = useCallback(() => {
    return (
      <Box py={6} px={4} bg="#ffffff" h="full" roundedTop="2xl">
        <SheetHeader sheetToClose="GuarantorFormSheet" title="Guarantor form" />
        <NativeViewGestureHandler
          simultaneousHandlers={handlers.simultaneousHandlers}>
          <ScrollView {...handlers}>
            <Formik
              initialValues={{
                first_guarantor_name: '',
                first_guarantor_phone_number: '',
                second_guarantor_name: '',
                second_guarantor_phone_number: '',
                previous_place_of_work: '',
              }}
              validationSchema={step2Shema}
              onSubmit={values => {
                if (workDuration?.name) {
                  const upd = {
                    ...values,
                    previous_place_of_work_duration: workDuration.label,
                  };
                  console.log('values', upd);
                  doUpdate(upd);
                } else {
                  Toast.show({
                    type: 'warning',
                    text1: 'Guarantor Submission',
                    text2: 'Please select work duration',
                  });
                }
              }}>
              {({
                handleChange,
                handleSubmit,
                handleBlur,
                touched,
                errors,
                values,
              }) => (
                <VStack space={4} mt={4}>
                  <Box>
                    <Input
                      label="First Guarantor Name"
                      placeholder="First Guarantor Name"
                      onChangeText={handleChange('first_guarantor_name')}
                      onBlur={handleBlur('first_guarantor_name')}
                      isRequired
                      errorMessage={errors.first_guarantor_name}
                      hasError={
                        errors.first_guarantor_name &&
                        touched.first_guarantor_name
                          ? true
                          : false
                      }
                      value={values.first_guarantor_name}
                      // py={Platform.OS === 'ios' ? 4 : 2}
                    />
                  </Box>
                  <Box>
                    <Input
                      label="First Guarantor Phone Number"
                      placeholder="First Guarantor Phone Number"
                      onChangeText={handleChange(
                        'first_guarantor_phone_number',
                      )}
                      onBlur={handleBlur('first_guarantor_phone_number')}
                      isRequired
                      errorMessage={errors.first_guarantor_phone_number}
                      hasError={
                        errors.first_guarantor_phone_number &&
                        touched.first_guarantor_phone_number
                          ? true
                          : false
                      }
                      value={values.first_guarantor_phone_number}
                      // py={Platform.OS === 'ios' ? 4 : 2}
                    />
                  </Box>
                  <Box>
                    <Input
                      label="Second Guarantor Name"
                      placeholder="Second Guarantor Name"
                      onChangeText={handleChange('second_guarantor_name')}
                      onBlur={handleBlur('second_guarantor_name')}
                      isRequired
                      errorMessage={errors.second_guarantor_name}
                      hasError={
                        errors.second_guarantor_name &&
                        touched.second_guarantor_name
                          ? true
                          : false
                      }
                      value={values.second_guarantor_name}
                      // py={Platform.OS === 'ios' ? 4 : 2}
                    />
                  </Box>
                  <Box>
                    <Input
                      label="Second Guarantor Phone Number"
                      placeholder="Second Guarantor Phone Number"
                      onChangeText={handleChange(
                        'second_guarantor_phone_number',
                      )}
                      onBlur={handleBlur('second_guarantor_phone_number')}
                      isRequired
                      errorMessage={errors.second_guarantor_phone_number}
                      hasError={
                        errors.second_guarantor_phone_number &&
                        touched.second_guarantor_phone_number
                          ? true
                          : false
                      }
                      value={values.second_guarantor_phone_number}
                      // py={Platform.OS === 'ios' ? 4 : 2}
                    />
                  </Box>
                  <Box>
                    <Input
                      label="Previous Place of Work"
                      placeholder="Previous Place of Work"
                      onChangeText={handleChange('previous_place_of_work')}
                      onBlur={handleBlur('previous_place_of_work')}
                      isRequired
                      errorMessage={errors.previous_place_of_work}
                      hasError={
                        errors.previous_place_of_work &&
                        touched.previous_place_of_work
                          ? true
                          : false
                      }
                      value={values.previous_place_of_work}
                      // py={Platform.OS === 'ios' ? 4 : 2}
                    />
                  </Box>
                  <Box>
                    <Text>How long did you work there for?</Text>
                    <Pressable
                      onPress={getSelectedBrand}
                      bg="gray.200"
                      w="full"
                      h="54px"
                      justifyContent="center"
                      px={2}
                      my={2}
                      rounded="md">
                      <HStack
                        justifyContent="space-between"
                        alignItems="center">
                        {workDuration?.label ? (
                          <Text>{workDuration.name}</Text>
                        ) : (
                          <Text>Select Work Duration</Text>
                        )}
                        <ChevronDownIcon />
                      </HStack>
                    </Pressable>
                    {/* {errors.previous_place_of_work_duration && (
                    <Text color="red.500">{errors.previous_place_of_work}</Text>
                  )} */}
                  </Box>
                  <Button
                    py={4}
                    rounded="full"
                    isLoading={profileUpdate.isLoading}
                    isLoadingText="updating..."
                    mt={8}
                    onPress={() => handleSubmit()}
                    _text={{fontWeight: 'bold'}}>
                    Update
                  </Button>
                </VStack>
              )}
            </Formik>
          </ScrollView>
        </NativeViewGestureHandler>
        <Toast />
      </Box>
    );
  }, [
    doUpdate,
    handlers,
    profileUpdate.isLoading,
    step2Shema,
    workDuration?.label,
    workDuration?.name,
  ]);

  return (
    <ActionSheet
      id={props.sheetId}
      ref={guarantorFormSheetRef}
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
