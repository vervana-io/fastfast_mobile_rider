import {useDispatch} from 'react-redux';
import {AcceptOrderType} from '../../../../../redux/order/orderService';
import {rejectOrderRequest} from '../../../../../redux/order/orderSlice';
import {useAppSelector} from '../../../../../redux/store';

export const useRejectOrder = () => {
  const dispatch: any = useDispatch();
  const {loading} = useAppSelector(state => state.orderReducer);

  const handleRejectOrder = ({order_id, request_id}: AcceptOrderType) => {
    dispatch(
      rejectOrderRequest({
        order_id,
        request_id,
      }),
    );
  };

  return {
    handleRejectOrder,
    loading,
  };
};
