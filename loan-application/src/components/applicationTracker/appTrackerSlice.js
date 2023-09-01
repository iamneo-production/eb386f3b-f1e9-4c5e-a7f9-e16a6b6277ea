import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchApplicationsByUserId } from './AppTrackerApi';

const initialState = {
  applications: [],
  status: 'idle',
};

export const fetchApplicationsByUserIdAsync = createAsyncThunk(
  'application/fetchApplicationsByUserId',
  async (userId) => {
    const response = await fetchApplicationsByUserId(userId);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplicationsByUserIdAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchApplicationsByUserIdAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.applications = action.payload;
      });
  },
});

export const { increment } = applicationSlice.actions;

export const selectApplications = (state) => state.application.applications;

export default applicationSlice.reducer;