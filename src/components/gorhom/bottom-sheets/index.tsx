import BottomSheet from '@gorhom/bottom-sheet';
import {OrderDetailsViewSheet} from './orderDetailsViewSheet';
import {ProfileViewSheet} from './profileViewSheet';
import React from 'react';

export const AllBottomSheets = () => {
  return (
    <>
      <ProfileViewSheet />
      <OrderDetailsViewSheet />
    </>
  );
};
