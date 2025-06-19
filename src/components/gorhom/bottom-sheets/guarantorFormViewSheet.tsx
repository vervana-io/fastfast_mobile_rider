import {Input} from '@components/inputs';
import {workDurationTypes} from '@components/sheets/WorkDurationSheet';
import {SheetHeader} from '@components/ui';
import BottomSheet from '@gorhom/bottom-sheet';
import {useUser} from '@hooks/useUser';
import {bottomSheetStore} from '@store/bottom-sheet';
import {apiType} from '@types/apiTypes';
import {profileUpdateType} from '@types/userTypes';
import {Formik} from 'formik';
import {observer} from 'mobx-react-lite';
import {
  Box,
  Button,
  ChevronDownIcon,
  HStack,
  Pressable,
  Text,
  VStack,
} from 'native-base';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {SheetManager} from 'react-native-actions-sheet';
import Toast from 'react-native-toast-message';
import {object, string} from 'yup';

// Error Boundary for development
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false, error: null};
  }
  static getDerivedStateFromError(error) {
    return {hasError: true, error};
  }
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <Box bg="red.100" p={4}>
          <Text color="red.600" fontWeight="bold">
            An error occurred in GuarantorFormSheet:
          </Text>
          <Text color="red.600">{String(this.state.error)}</Text>
        </Box>
      );
    }
    return this.props.children;
  }
}

const step2Schema = object({
  first_guarantor_name: string().required('Guarantor name is required'),
  first_guarantor_phone_number: string().required(
    'Guarantor phone is required',
  ),
  second_guarantor_name: string().required('Second Guarantor name is required'),
  second_guarantor_phone_number: string().required(
    'Second Guarantor phone number is required',
  ),
  previous_place_of_work: string().required(
    'Previous Place of work is required',
  ),
});

const initialValues = {
  first_guarantor_name: '',
  first_guarantor_phone_number: '',
  second_guarantor_name: '',
  second_guarantor_phone_number: '',
  previous_place_of_work: '',
};

const GuarantorFormSheetInner = observer(() => {
  const sheetRef = useRef<BottomSheet>(null);
  const sheetOpen = bottomSheetStore.sheets.guarantorView;
  const [workDuration, setWorkDuration] = useState<workDurationTypes>();
  const {profileUpdate, userDetails} = useUser();

  // Defensive: always call functions!
  const handleClosePress = useCallback(() => {
    if (sheetRef.current) sheetRef.current.close();
    bottomSheetStore.SetSheet('guarantorView', false);
  }, []);
  const handleExpand = useCallback(() => {
    if (sheetRef.current) sheetRef.current.expand();
  }, []);

  // Defensive: always check returned value
  const getSelectedBrand = useCallback(async () => {
    try {
      const _workDuration: workDurationTypes = await SheetManager.show(
        'WorkDurationSheet',
      );
      if (_workDuration) setWorkDuration(_workDuration);
    } catch (e) {
      console.error('Error selecting work duration:', e);
    }
  }, []);

  // Defensive: always check workDuration and log errors
  const doUpdate = useCallback(
    async (update: profileUpdateType) => {
      try {
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
                handleClosePress();
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
            console.error('Profile update error:', error);
            Toast.show({
              type: 'error',
              text1: 'Profile Update',
              text2: 'An error occurred while updating',
            });
          },
        });
      } catch (e) {
        console.error('doUpdate exception:', e);
      }
    },
    [profileUpdate, userDetails, handleClosePress],
  );

  // Fix: always call functions in useEffect!
  useEffect(() => {
    if (sheetOpen) {
      handleExpand();
    } else {
      handleClosePress();
    }
  }, [sheetOpen, handleExpand, handleClosePress]);

  const snapPoints = useMemo(() => ['80%', '95%'], []);

  if (!sheetOpen) return null;

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: 50,
          paddingBottom: 150,
          paddingHorizontal: 20,
          backgroundColor: 'white',
        }}
        keyboardShouldPersistTaps="handled">
        <SheetHeader sheetToClose="guarantorView" title="Guarantor form" />

        <Formik
          initialValues={initialValues}
          validationSchema={step2Schema}
          onSubmit={values => {
            if (workDuration?.name) {
              const upd = {
                ...values,
                previous_place_of_work_duration: workDuration.label,
              };
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
                    !!(
                      errors.first_guarantor_name &&
                      touched.first_guarantor_name
                    )
                  }
                  value={values.first_guarantor_name || ''}
                />
              </Box>

              <Box>
                <Input
                  label="First Guarantor Phone Number"
                  placeholder="First Guarantor Phone Number"
                  onChangeText={handleChange('first_guarantor_phone_number')}
                  onBlur={handleBlur('first_guarantor_phone_number')}
                  keyboardType="number-pad"
                  isRequired
                  errorMessage={errors.first_guarantor_phone_number}
                  hasError={
                    !!(
                      errors.first_guarantor_phone_number &&
                      touched.first_guarantor_phone_number
                    )
                  }
                  value={values.first_guarantor_phone_number || ''}
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
                    !!(
                      errors.second_guarantor_name &&
                      touched.second_guarantor_name
                    )
                  }
                  value={values.second_guarantor_name || ''}
                />
              </Box>

              <Box>
                <Input
                  label="Second Guarantor Phone Number"
                  placeholder="Second Guarantor Phone Number"
                  onChangeText={handleChange('second_guarantor_phone_number')}
                  keyboardType="number-pad"
                  onBlur={handleBlur('second_guarantor_phone_number')}
                  isRequired
                  errorMessage={errors.second_guarantor_phone_number}
                  hasError={
                    !!(
                      errors.second_guarantor_phone_number &&
                      touched.second_guarantor_phone_number
                    )
                  }
                  value={values.second_guarantor_phone_number || ''}
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
                    !!(
                      errors.previous_place_of_work &&
                      touched.previous_place_of_work
                    )
                  }
                  value={values.previous_place_of_work || ''}
                />
              </Box>

              <Box>
                <Text>How long did you work there for?</Text>
                <Pressable
                  onPress={getSelectedBrand}
                  style={{
                    backgroundColor: '#e5e5e5',
                    width: '100%',
                    height: 54,
                    justifyContent: 'center',
                    paddingHorizontal: 8,
                    marginTop: 8,
                    marginBottom: 8,
                    borderRadius: 8,
                  }}>
                  <HStack justifyContent="space-between" alignItems="center">
                    {workDuration?.label ? (
                      <Text>{workDuration.name}</Text>
                    ) : (
                      <Text>Select Work Duration</Text>
                    )}
                    <ChevronDownIcon />
                  </HStack>
                </Pressable>
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
    </KeyboardAvoidingView>
  );
});

// Wrap with error boundary for dev
export const GuarantorFormSheet = props => (
  <ErrorBoundary>
    <GuarantorFormSheetInner {...props} />
  </ErrorBoundary>
);
