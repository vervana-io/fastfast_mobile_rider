import {useAppSelector} from '../../../../../redux/store';
import {useAcceptOrder} from '../use-accept-order';
import {useRejectOrder} from '../use-decline-order';

export const useDashboard = () => {
  const {currentSelectedOrder, loading} = useAppSelector(
    state => state.orderReducer,
  );
  const {handleAcceptOrder} = useAcceptOrder();
  const {handleRejectOrder} = useRejectOrder();

  return {
    handleAcceptOrder,
    loading,
    currentSelectedOrder,
    handleRejectOrder,
  };
};
