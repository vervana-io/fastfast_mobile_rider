import {observer} from 'mobx-react-lite';
import React from 'react';
import {GuarantorFormSheet} from './guarantorFormViewSheet';
import {OrderDetailsViewSheet} from './orderDetailsViewSheet';
import {ProfileViewSheet} from './profileViewSheet';

export const AllBottomSheets = observer(() => {
  return (
    <>
      <ProfileViewSheet />
      <OrderDetailsViewSheet />
      <GuarantorFormSheet />
    </>
  );
});
