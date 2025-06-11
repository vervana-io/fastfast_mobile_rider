import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
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
import {Keyboard, TouchableWithoutFeedback} from 'react-native';
import {object, string} from 'yup';
import {Formik} from 'formik';
import {Input} from '@components/inputs';
import {KeyboardAvoiding} from '@components/utils';
import {SheetHeader} from '@components/ui';
import {SheetManager} from 'react-native-actions-sheet';
import Toast from 'react-native-toast-message';
import {apiType} from '@types/apiTypes';
import {bottomSheetStore} from '@store/bottom-sheet';
import {observer} from 'mobx-react-lite';
import {profileUpdateType} from '@types/userTypes';
import {useUser} from '@hooks/useUser';
import {workDurationTypes} from '@components/sheets/WorkDurationSheet';

// Static validation schema
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

// Stable initial values
const initialValues = {
  first_guarantor_name: '',
  first_guarantor_phone_number: '',
  second_guarantor_name: '',
  second_guarantor_phone_number: '',
  previous_place_of_work: '',
};

// Highly optimized Input component that prevents unnecessary re-renders
const StableInput = React.memo<{
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  keyboardType?: string;
  isRequired?: boolean;
  errorMessage?: string;
  hasError?: boolean;
}>(
  ({
    label,
    placeholder,
    value,
    onChangeText,
    onBlur,
    keyboardType,
    isRequired = false,
    errorMessage,
    hasError = false,
  }) => (
    <Input
      label={label}
      placeholder={placeholder}
      onChangeText={onChangeText}
      onBlur={onBlur}
      isRequired={isRequired}
      errorMessage={errorMessage}
      hasError={hasError}
      value={value}
      keyboardType={keyboardType}
    />
  ),
);

StableInput.displayName = 'StableInput';

// Work Duration Selector
const WorkDurationSelector = React.memo<{
  workDuration?: workDurationTypes;
  onPress: () => void;
}>(({workDuration, onPress}) => (
  <Box>
    <Text mb={2}>How long did you work there for?</Text>
    <Pressable
      onPress={onPress}
      bg="gray.200"
      w="full"
      h="54px"
      justifyContent="center"
      px={2}
      rounded="md">
      <HStack justifyContent="space-between" alignItems="center">
        <Text>{workDuration?.name || 'Select Work Duration'}</Text>
        <ChevronDownIcon />
      </HStack>
    </Pressable>
  </Box>
));

WorkDurationSelector.displayName = 'WorkDurationSelector';

// Form content component that prevents re-renders
const FormContent = React.memo<{
  values: typeof initialValues;
  errors: any;
  touched: any;
  handleChange: (field: string) => (value: string) => void;
  handleBlur: (field: string) => () => void;
  workDuration?: workDurationTypes;
  onWorkDurationPress: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}>(
  ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    workDuration,
    onWorkDurationPress,
    onSubmit,
    isLoading,
  }) => (
    <VStack space={4} mt={4}>
      <StableInput
        label="First Guarantor Name"
        placeholder="First Guarantor Name"
        value={values.first_guarantor_name}
        onChangeText={handleChange('first_guarantor_name')}
        onBlur={handleBlur('first_guarantor_name')}
        isRequired
        errorMessage={
          touched.first_guarantor_name && errors.first_guarantor_name
        }
        hasError={
          !!(touched.first_guarantor_name && errors.first_guarantor_name)
        }
      />

      <StableInput
        label="First Guarantor Phone Number"
        placeholder="First Guarantor Phone Number"
        value={values.first_guarantor_phone_number}
        onChangeText={handleChange('first_guarantor_phone_number')}
        onBlur={handleBlur('first_guarantor_phone_number')}
        keyboardType="number-pad"
        isRequired
        errorMessage={
          touched.first_guarantor_phone_number &&
          errors.first_guarantor_phone_number
        }
        hasError={
          !!(
            touched.first_guarantor_phone_number &&
            errors.first_guarantor_phone_number
          )
        }
      />

      <StableInput
        label="Second Guarantor Name"
        placeholder="Second Guarantor Name"
        value={values.second_guarantor_name}
        onChangeText={handleChange('second_guarantor_name')}
        onBlur={handleBlur('second_guarantor_name')}
        isRequired
        errorMessage={
          touched.second_guarantor_name && errors.second_guarantor_name
        }
        hasError={
          !!(touched.second_guarantor_name && errors.second_guarantor_name)
        }
      />

      <StableInput
        label="Second Guarantor Phone Number"
        placeholder="Second Guarantor Phone Number"
        value={values.second_guarantor_phone_number}
        onChangeText={handleChange('second_guarantor_phone_number')}
        onBlur={handleBlur('second_guarantor_phone_number')}
        keyboardType="number-pad"
        isRequired
        errorMessage={
          touched.second_guarantor_phone_number &&
          errors.second_guarantor_phone_number
        }
        hasError={
          !!(
            touched.second_guarantor_phone_number &&
            errors.second_guarantor_phone_number
          )
        }
      />

      <StableInput
        label="Previous Place of Work"
        placeholder="Previous Place of Work"
        value={values.previous_place_of_work}
        onChangeText={handleChange('previous_place_of_work')}
        onBlur={handleBlur('previous_place_of_work')}
        isRequired
        errorMessage={
          touched.previous_place_of_work && errors.previous_place_of_work
        }
        hasError={
          !!(touched.previous_place_of_work && errors.previous_place_of_work)
        }
      />

      <WorkDurationSelector
        workDuration={workDuration}
        onPress={onWorkDurationPress}
      />

      <Button
        py={4}
        rounded="full"
        isLoading={isLoading}
        isLoadingText="Updating..."
        mt={8}
        onPress={onSubmit}
        _text={{fontWeight: 'bold'}}>
        Update
      </Button>
    </VStack>
  ),
);

FormContent.displayName = 'FormContent';

const GuarantorFormSheetContent = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const sheetOpen = bottomSheetStore.sheets.guarantorView;
  const [workDuration, setWorkDuration] = useState<
    workDurationTypes | undefined
  >(undefined);
  const {profileUpdate, userDetails} = useUser();

  // Memoized snap points
  const snapPoints = useMemo(() => ['80%', '95%'], []);

  // Dismiss keyboard function
  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  // Stable callback functions
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
    bottomSheetStore.SetSheet('guarantorView', false);
  }, []);

  const handleExpand = useCallback(() => {
    sheetRef.current?.expand();
  }, []);

  const handleWorkDurationSelect = useCallback(async () => {
    try {
      const selectedDuration: workDurationTypes = await SheetManager.show(
        'WorkDurationSheet',
      );
      if (selectedDuration) {
        setWorkDuration(selectedDuration);
      }
    } catch (error) {
      // Handle sheet dismissal gracefully
    }
  }, []);

  // Optimized update function
  const handleProfileUpdate = useCallback(
    async (values: typeof initialValues) => {
      if (!workDuration?.name) {
        Toast.show({
          type: 'warning',
          text1: 'Guarantor Submission',
          text2: 'Please select work duration',
        });
        return;
      }

      const updateData: profileUpdateType = {
        ...values,
        previous_place_of_work_duration: workDuration.label,
      };

      profileUpdate.mutate(updateData, {
        onSuccess: (response: apiType) => {
          if (response.status) {
            userDetails.refetch();
            Toast.show({
              type: 'success',
              text1: 'Profile Update',
              text2: 'Guarantor form updated successfully',
            });
            setTimeout(handleClosePress, 800);
          } else {
            Toast.show({
              type: 'error',
              text1: 'Profile Update',
              text2: response.message || 'Update failed',
            });
          }
        },
        onError: () => {
          Toast.show({
            type: 'error',
            text1: 'Profile Update',
            text2: 'An error occurred while updating',
          });
        },
      });
    },
    [workDuration, profileUpdate, userDetails, handleClosePress],
  );

  // Effect for handling sheet state
  useEffect(() => {
    if (sheetOpen) {
      handleExpand();
    } else {
      handleClosePress();
    }
  }, [sheetOpen, handleExpand, handleClosePress]);

  // Early return for performance
  if (!sheetOpen) return null;

  return (
    <BottomSheet
      ref={sheetRef}
      index={1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      enableContentPanningGesture={false}
      onClose={handleClosePress}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore">
      <BottomSheetView style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <BottomSheetScrollView
            style={{paddingHorizontal: 12}}
            contentContainerStyle={{paddingBottom: 40}}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <SheetHeader sheetToClose="guarantorView" title="Guarantor form" />

            <KeyboardAvoiding>
              <Formik
                initialValues={initialValues}
                validationSchema={step2Schema}
                validateOnChange={false}
                validateOnBlur={true}
                validateOnMount={false}
                onSubmit={handleProfileUpdate}>
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                }) => (
                  <FormContent
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    workDuration={workDuration}
                    onWorkDurationPress={handleWorkDurationSelect}
                    onSubmit={handleSubmit}
                    isLoading={profileUpdate.isLoading}
                  />
                )}
              </Formik>
            </KeyboardAvoiding>
          </BottomSheetScrollView>
        </TouchableWithoutFeedback>
      </BottomSheetView>
    </BottomSheet>
  );
};

// Observer wrapper
const ObservedGuarantorFormSheet = observer(GuarantorFormSheetContent);
ObservedGuarantorFormSheet.displayName = 'GuarantorFormSheet';

export const GuarantorFormSheet = ObservedGuarantorFormSheet;
