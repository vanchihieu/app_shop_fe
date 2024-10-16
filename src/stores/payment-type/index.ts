// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Actions
import {
  createPaymentTypeAsync,
  deleteMultiplePaymentTypeAsync,
  deletePaymentTypeAsync,
  getAllPaymentTypesAsync,
  serviceName,
  updatePaymentTypeAsync
} from 'src/stores/payment-type/actions'

const initialState = {
  isLoading: false,
  isSuccess: true,
  isError: false,
  message: '',
  typeError: '',
  isSuccessCreateEdit: false,
  isErrorCreateEdit: false,
  messageErrorCreateEdit: '',
  isSuccessDelete: false,
  isErrorDelete: false,
  messageErrorDelete: '',
  isSuccessMultipleDelete: false,
  isErrorMultipleDelete: false,
  messageErrorMultipleDelete: '',
  paymentTypes: {
    data: [],
    total: 0
  }
}

export const paymentTypeSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    resetInitialState: state => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = ''
      state.typeError = ''
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = true
      state.messageErrorCreateEdit = ''
      state.isSuccessDelete = false
      state.isErrorDelete = true
      state.messageErrorDelete = ''
      state.isSuccessMultipleDelete = false
      state.isErrorMultipleDelete = true
      state.messageErrorMultipleDelete = ''
    }
  },
  extraReducers: builder => {
    // ** get all payment types
    builder.addCase(getAllPaymentTypesAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getAllPaymentTypesAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.paymentTypes.data = action.payload?.data?.paymentTypes || []
      state.paymentTypes.total = action.payload?.data?.totalCount
    })
    builder.addCase(getAllPaymentTypesAsync.rejected, (state, action) => {
      state.isLoading = false
      state.paymentTypes.data = []
      state.paymentTypes.total = 0
    })

    // ** create payment type
    builder.addCase(createPaymentTypeAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(createPaymentTypeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreateEdit = !!action.payload?.data?._id
      state.isErrorCreateEdit = !action.payload?.data?._id
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** update payment type
    builder.addCase(updatePaymentTypeAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updatePaymentTypeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreateEdit = !!action.payload?.data?._id
      state.isErrorCreateEdit = !action.payload?.data?._id
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** delete payment type
    builder.addCase(deletePaymentTypeAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deletePaymentTypeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessDelete = !!action.payload?.data?._id
      state.isErrorDelete = !action.payload?.data?._id
      state.messageErrorDelete = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    // ** delete multiple payment type
    builder.addCase(deleteMultiplePaymentTypeAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteMultiplePaymentTypeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessMultipleDelete = !!action.payload?.data
      state.isErrorMultipleDelete = !action.payload?.data
      state.messageErrorMultipleDelete = action.payload?.message
      state.typeError = action.payload?.typeError
    })
  }
})

export const { resetInitialState } = paymentTypeSlice.actions
export default paymentTypeSlice.reducer
