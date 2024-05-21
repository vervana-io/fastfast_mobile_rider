/* eslint-disable react-native/no-inline-styles */
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import React, {useCallback, useRef, useState} from 'react';

import {Box} from 'native-base';
import {WIN_HEIGHT} from '../../config';
import {observer} from 'mobx-react-lite';

export const EmptySheet = observer((props: SheetProps) => {
  const emptySheetRef = useRef<ActionSheetRef>(null);

  const Content = useCallback(() => {
    return <Box py={6} px={4} bg="#1B1B1B" h="full" roundedTop="2xl" />;
  }, []);

  return (
    <ActionSheet
      id={props.sheetId}
      ref={emptySheetRef}
      indicatorStyle={{
        width: 0,
      }}
      gestureEnabled={true}
      containerStyle={{
        height: WIN_HEIGHT * 0.6,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: 'white',
        // backgroundColor: colorMode === 'dark' ? '#111827' : '#fff',
      }}>
      {Content()}
    </ActionSheet>
  );
});
