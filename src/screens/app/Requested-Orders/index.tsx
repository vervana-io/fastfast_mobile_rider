import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ActivityIndicator, Button, FlatList, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {orderSlice} from '../../../redux/order/orderSlice';
import {NewRequestOrder} from '../../../redux/order/type';
import {useGetOrders} from './hooks/use-get-orders';
import {requestOrderStyles} from './styles';

const RequestedOrders = () => {
  const dispatch: any = useDispatch();
  const navigation: any = useNavigation();
  const {allOrders, loading} = useGetOrders();
  const styles = requestOrderStyles;

  //move to it own hook

  const updateSelectedOrder = (order: NewRequestOrder) => {
    dispatch(orderSlice.actions.setCurrentSelectedOrder(order));
    navigation.navigate('Dashboard', {order: order.id});
  };

  const renderItem = ({item}: {item: NewRequestOrder}) => (
    <View style={styles.card}>
      <Text style={styles.title}>Order Ref: {item.reference}</Text>
      <Text>Status: {item.status_name}</Text>
      <Text>Seller: {item.seller?.name}</Text>
      <Text>Total: ₦{parseFloat(item.total_amount).toFixed(2)}</Text>
      <Button
        title="Open Order"
        onPress={() => {
          updateSelectedOrder(item);
        }}
      />
    </View>
  );

  if (loading) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      <FlatList
        data={allOrders}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
      />
    </View>
  );
};

export default RequestedOrders;
