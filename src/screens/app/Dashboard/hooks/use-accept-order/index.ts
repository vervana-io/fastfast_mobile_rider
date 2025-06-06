import {useDispatch} from 'react-redux';
import {AcceptOrderType} from '../../../../../redux/order/orderService';
import {acceptOrderRequest} from '../../../../../redux/order/orderSlice';
import {useAppSelector} from '../../../../../redux/store';

export const useAcceptOrder = () => {
  const dispatch: any = useDispatch();
  const {loading} = useAppSelector(state => state.orderReducer);

  const handleAcceptOrder = ({order_id, request_id}: AcceptOrderType) => {
    dispatch(
      acceptOrderRequest({
        order_id,
        request_id,
      }),
    );
  };

  return {
    handleAcceptOrder,
    loading,
  };
};
