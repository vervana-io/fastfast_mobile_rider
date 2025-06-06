import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Alert} from 'react-native';
import {
  accept_order_request,
  AcceptOrderType,
  get_order_requests,
  reject_order_request,
} from './orderService';
import {NewRequestOrder, NewRequestPaginatedOrdersResponse} from './type';

export type OrderState = {
  allOrders: NewRequestOrder[];
  currentSelectedOrder: NewRequestOrder | null;
  loading: boolean;
};

const initialState: OrderState = {
  currentSelectedOrder: null,
  loading: false,
  allOrders: [],
};

export const acceptOrderRequest = createAsyncThunk(
  'users/acceptOrderRequest',
  async ({order_id, request_id}: AcceptOrderType, thunkAPI) => {
    try {
      console.log(order_id, request_id, 'order_id, request_id');
      const response = await accept_order_request({order_id, request_id});
      Alert.alert('Order accepted successfully');
      return response;
      //we should get the order details again.
    } catch (error: unknown) {
      console.log(error, ' error from opeation');
      Alert.alert('Operation Failed');
    }
  },
);
export const rejectOrderRequest = createAsyncThunk(
  'users/rejectOrderRequest',
  async ({order_id, request_id}: AcceptOrderType, thunkAPI) => {
    try {
      const response = await reject_order_request({order_id, request_id});
      Alert.alert('Order rejected successfully');
      return response;
    } catch (error: unknown) {
      Alert.alert('Operation Failed');
    }
  },
);
export const getOrderRequests = createAsyncThunk(
  'users/getOrderRequests',
  async () => {
    try {
      return await get_order_requests();
    } catch (error: unknown) {
      Alert.alert('Operation Failed');
    }
  },
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCurrentSelectedOrder: (
      state,
      action: PayloadAction<NewRequestOrder>,
    ) => {
      state.currentSelectedOrder = action.payload;
    },
  },

  extraReducers: builder => {
    builder.addCase(
      acceptOrderRequest.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.currentSelectedOrder = action.payload;
        state.loading = false;
      },
    );
    builder.addCase(
      acceptOrderRequest.rejected,
      (state, _: PayloadAction<any>) => {
        state.loading = false;
        state.currentSelectedOrder = null;
      },
    );
    builder.addCase(
      acceptOrderRequest.pending,
      (state, _: PayloadAction<any>) => {
        state.loading = true;
      },
    );
    builder.addCase(
      getOrderRequests.fulfilled,
      (state, action: PayloadAction<NewRequestPaginatedOrdersResponse>) => {
        state.allOrders = action.payload?.data;
        state.loading = false;
      },
    );
    builder.addCase(
      getOrderRequests.rejected,
      (state, _: PayloadAction<any>) => {
        state.loading = false;
        state.allOrders = [];
      },
    );
    builder.addCase(
      getOrderRequests.pending,
      (state, _: PayloadAction<any>) => {
        state.loading = true;
      },
    );
    builder.addCase(
      rejectOrderRequest.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.currentSelectedOrder = action.payload;
        state.loading = false;
      },
    );
    builder.addCase(
      rejectOrderRequest.rejected,
      (state, _: PayloadAction<any>) => {
        state.loading = false;
        state.currentSelectedOrder = null;
      },
    );
    builder.addCase(
      rejectOrderRequest.pending,
      (state, _: PayloadAction<any>) => {
        state.loading = true;
      },
    );
  },
});

export const orderReducer = orderSlice.reducer;
