import {observer} from 'mobx-react-lite';
import {GuarantorFormSheet} from './guarantorFormViewSheet';
import {OrderDetailsViewSheet} from './orderDetailsViewSheet';
import React from 'react';
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
