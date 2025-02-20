/* eslint-disable react-native/no-inline-styles */
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetScrollView,
  BottomSheetView,
  useBottomSheet,
} from '@gorhom/bottom-sheet';
import {
  Box,
  Button,
  Center,
  ChevronDownIcon,
  ChevronRightIcon,
  HStack,
  Image,
  Link,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {object, string} from 'yup';

import {Formik} from 'formik';
import {IDCard} from '@assets/svg/idCard';
import {Input} from '@components/inputs';
import {KeyboardAvoiding} from '@components/utils';
import {Platform} from 'react-native';
import {SheetHeader} from '@components/ui';
import {SheetManager} from 'react-native-actions-sheet';
import {StarIcon} from '@assets/svg/StarIcon';
import Toast from 'react-native-toast-message';
import {UserIcon} from '@assets/svg/UserIcon';
import {WIN_HEIGHT} from '../../../config';
import {apiType} from '@types/apiTypes';
import {authStore} from '@store/auth';
import {bottomSheetStore} from '@store/bottom-sheet';
import dayjs from 'dayjs';
import {observer} from 'mobx-react-lite';
import {profileUpdateType} from '@types/userTypes';
import {useUser} from '@hooks/useUser';
import {workDurationTypes} from '@components/sheets/WorkDurationSheet';

const complimentsList = [
  {
    image: require('@assets/img/Profile1.png'),
    rating: '4.5',
    name: 'Friendly',
    id: '1',
  },
  {
    image: require('@assets/img/Profile1.png'),
    rating: '4.5',
    name: 'Friendly',
    id: '2',
  },
  {
    image: require('@assets/img/Profile2.png'),
    rating: '4.5',
    name: 'Fast and decent',
    id: '3',
  },
  {
    image: require('@assets/img/Profile2.png'),
    rating: '4.5',
    name: 'Fast and decent',
    id: '4',
  },
];

export const GuarantorFormSheet = observer(() => {
  const sheetRef: any = useRef<BottomSheet>(null);

  const sheetOpen = bottomSheetStore.sheets.guarantorView;

  const handleClosePress = () => sheetRef.current.close();
  const handleExpand = () => sheetRef.current.expand();

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
            Toast.show({
              type: 'success',
              text1: 'Profile Update',
              text2: 'Guarantor form updated successfully',
            });
            setTimeout(() => {
              handleClosePress;
              bottomSheetStore.SetSheet('guarantorView', false);
            }, 1000);
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

  useEffect(() => {
    if (sheetOpen) {
      handleExpand;
    } else {
      handleClosePress;
      bottomSheetStore.SetSheet('guarantorView', false);
    }
  }, [sheetOpen]);

  const snapPoints = useMemo(() => ['80%', '95%'], []);

  return (
    sheetOpen && (
      <BottomSheet index={1} snapPoints={snapPoints}>
        <BottomSheetView>
          <BottomSheetScrollView
            style={{paddingHorizontal: 12, paddingBottom: 40}}>
            <SheetHeader sheetToClose="guarantorView" title="Guarantor form" />
            <KeyboardAvoiding>
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
                        keyboardType="number-pad"
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
                        keyboardType="number-pad"
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
            </KeyboardAvoiding>
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheet>
    )
  );
});
