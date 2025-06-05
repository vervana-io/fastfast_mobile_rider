import {MapIcon} from '@assets/svg/MapIcon';
import {useSheet} from '@hooks/useSheet';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useAppSelector} from '../../../redux/store';
import AppSheet from '../app-sheet';

const AppDisplayOrderDetails = () => {
  const {currentSelectedOrder} = useAppSelector(state => state.orderReducer);
  const {openSheet, sheetRef} = useSheet();

  if (!currentSelectedOrder) return null;

  const {
    seller,
    order_products,
    address,
    reference,
    status_name,
    sub_total,
    service_charge,
    delivery_fee,
    total_amount,
    delivery_address,
  } = currentSelectedOrder;

  return (
    <>
      <TouchableOpacity onPress={openSheet}>
        <MapIcon />
      </TouchableOpacity>

      <AppSheet adjustToContentHeight closeOnOverlayTap sheetRef={sheetRef}>
        <View></View>
      </AppSheet>
    </>
  );
};

export default AppDisplayOrderDetails;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    maxHeight: '90%',
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 12,
    borderRadius: 8,
  },
  sellerName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  status: {
    color: '#888',
    fontSize: 13,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 20,
    marginBottom: 6,
  },
  reference: {
    fontSize: 13,
    color: '#555',
  },
  productCard: {
    flexDirection: 'row',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 6,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  productDesc: {
    color: '#555',
    fontSize: 12,
    marginVertical: 2,
  },
  productQty: {
    fontSize: 12,
    color: '#666',
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  addressText: {
    fontSize: 13,
    color: '#444',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  label: {
    fontSize: 13,
    color: '#666',
  },
  value: {
    fontSize: 13,
    color: '#000',
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  totalValue: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});
