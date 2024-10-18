// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Actions
import {
  cancelOrderProductOfMeAsync,
  createOrderProductAsync,
  deleteOrderProductAsync,
  getAllOrderProductsAsync,
  getAllOrderProductsByMeAsync,
  serviceName,
  updateOrderProductAsync,
  updateStatusOrderProductAsync
} from 'src/stores/order-product/actions'

const initialState = {
  isSuccessCreate: false,
  isErrorCreate: false,
  messageErrorCreate: '',
  isSuccessCancelMe: false,
  isErrorCancelMe: false,
  messageErrorCancelMe: '',
  isSuccessEdit: false,
  isErrorEdit: false,
  messageErrorEdit: '',
  isSuccessDelete: false,
  isErrorDelete: false,
  messageErrorDelete: '',
  isLoading: false,
  typeError: '',
  orderItems: [],
  orderProducts: {
    data: [],
    total: 0
  },
  ordersOfMe: {
    data: [],
    total: 0
  }
}

export const orderProductSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    updateProductToCart: (state, action) => {
      state.orderItems = action.payload.orderItems
    },
    resetInitialState: state => {
      state.isSuccessCreate = false
      state.isErrorCreate = true
      state.messageErrorCreate = ''
      state.typeError = ''
      state.isLoading = false
      state.isSuccessCancelMe = false
      state.isErrorCancelMe = true
      state.messageErrorCancelMe = ''
      state.isSuccessEdit = false
      state.isErrorEdit = true
      state.messageErrorEdit = ''
      state.isSuccessDelete = false
      state.isErrorDelete = true
      state.messageErrorDelete = ''
    }
  },
  extraReducers: builder => {
    // ** get all order products by me
    builder.addCase(getAllOrderProductsByMeAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getAllOrderProductsByMeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.ordersOfMe.data = action.payload?.data?.orders || []
      state.ordersOfMe.total = action.payload?.data?.totalCount
    })
    builder.addCase(getAllOrderProductsByMeAsync.rejected, (state, action) => {
      state.isLoading = false
      state.ordersOfMe.data = []
      state.ordersOfMe.total = 0
    })

    // ** create order product
    builder.addCase(createOrderProductAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(createOrderProductAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreate = !!action.payload?.data?._id
      state.isErrorCreate = !action.payload?.data?._id
      state.messageErrorCreate = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** cancel order product of me
    builder.addCase(cancelOrderProductOfMeAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(cancelOrderProductOfMeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCancelMe = !!action.payload?.data?._id
      state.isErrorCancelMe = !action.payload?.data?._id
      state.messageErrorCancelMe = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** get all order products
    builder.addCase(getAllOrderProductsAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getAllOrderProductsAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.orderProducts.data = action.payload?.data?.orders || []
      state.orderProducts.total = action.payload?.data?.totalCount
    })
    builder.addCase(getAllOrderProductsAsync.rejected, (state, action) => {
      state.isLoading = false
      state.orderProducts.data = []
      state.orderProducts.total = 0
    })

    // ** update order product
    builder.addCase(updateOrderProductAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateOrderProductAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessEdit = !!action.payload?.data?._id
      state.isErrorEdit = !action.payload?.data?._id
      state.messageErrorEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** update status order product
    builder.addCase(updateStatusOrderProductAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateStatusOrderProductAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessEdit = !!action.payload?.data?._id
      state.isErrorEdit = !action.payload?.data?._id
      state.messageErrorEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** delete orders product
    builder.addCase(deleteOrderProductAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteOrderProductAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessDelete = !!action.payload?.data?._id
      state.isErrorDelete = !action.payload?.data?._id
      state.messageErrorDelete = action.payload?.message
      state.typeError = action.payload?.typeError
    })
  }
})

export const { updateProductToCart, resetInitialState } = orderProductSlice.actions
export default orderProductSlice.reducer
