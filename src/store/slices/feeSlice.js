import { createSlice } from '@reduxjs/toolkit'

const feeSlice = createSlice({
  name: 'fee',
  initialState: { fees: [], paymentHistory: [], receipt: null, dueAmount: 0, loading: false },
  reducers: {
    setFees: (state, action) => { state.fees = action.payload },
    setPaymentHistory: (state, action) => { state.paymentHistory = action.payload },
    setReceipt: (state, action) => { state.receipt = action.payload },
    setDueAmount: (state, action) => { state.dueAmount = action.payload },
    setLoading: (state, action) => { state.loading = action.payload }
  }
})
export const { setFees, setPaymentHistory, setReceipt, setDueAmount, setLoading } = feeSlice.actions
export default feeSlice.reducer
