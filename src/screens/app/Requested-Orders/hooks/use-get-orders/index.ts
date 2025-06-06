import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getOrderRequests} from '../../../../../redux/order/orderSlice';
import {RootState} from '../../../../../redux/store';

export const useGetOrders = () => {
  const dispatch: any = useDispatch();
  const {allOrders, loading} = useSelector(
    (state: RootState) => state.orderReducer,
  );

  const handleGetOrders = () => {
    dispatch(getOrderRequests());
  };

  useEffect(() => {
    handleGetOrders();
  }, []);

  return {
    handleGetOrders,
    allOrders,
    loading,
  };
};
