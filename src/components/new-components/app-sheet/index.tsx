import React, {FunctionComponent, useState} from 'react';
import {ActivityIndicator, Keyboard} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {wp} from '../../../new-resources/config';
import {HmSheetTypes} from './type';

/**
 *
 * @param enableSlideToClose defaults to true
 * @param snapHeight defaults to 0
 * @param contentHeight used to set the height of the sheet's content
 */
const AppSheet: FunctionComponent<HmSheetTypes> = (_props: HmSheetTypes) => {
  const {
    enableSlideToClose = true,
    disableBackDrop,
    sheetRef,
    onBackPress,
    modalStyle,
    snapHeight = 0,
    children,
    portal = true,
    topContent,
    contentHeight,
    ...otherProps
  } = _props;
  const Container = portal ? Portal : React.Fragment;
  const _contentHeight = contentHeight ? wp(contentHeight) : undefined;

  const [show, setShow] = useState<boolean>(false);
  return (
    <Container>
      <Modalize
        childrenStyle={{height: _contentHeight}}
        panGestureEnabled={enableSlideToClose}
        closeOnOverlayTap={disableBackDrop}
        keyboardAvoidingOffset={30}
        alwaysOpen={snapHeight}
        disableScrollIfPossible={false}
        scrollViewProps={{
          keyboardShouldPersistTaps: 'always',
          showsVerticalScrollIndicator: false,
        }}
        ref={sheetRef}
        onBackButtonPress={() => {
          if (onBackPress) {
            onBackPress();
          }
          return true;
        }}
        modalStyle={modalStyle}
        {...otherProps}
        onOpen={() => {
          setShow(true);
          Keyboard.dismiss();
          otherProps.onOpen?.();
        }}
        onClose={() => {
          otherProps.onClose?.();
          setShow(false);
        }}>
        {!show && <ActivityIndicator />}
        {show && topContent}
        {show && children}
      </Modalize>
    </Container>
  );
};

export default AppSheet;
