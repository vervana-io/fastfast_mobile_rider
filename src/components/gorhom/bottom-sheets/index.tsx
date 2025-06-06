import {GuarantorFormSheet} from './guarantorFormViewSheet';
import {OrderDetailsViewSheet} from './orderDetailsViewSheet';
import {ProfileViewSheet} from './profileViewSheet';
import React from 'react';

export const AllBottomSheets = () => {
  return (
    <>
      <ProfileViewSheet />
      <OrderDetailsViewSheet />
      <GuarantorFormSheet />
    </>
  );
};
