import { configureStore } from '@reduxjs/toolkit';
import proposalReducer from '../features/proposalSlice';

const store = configureStore({
  reducer: {
    proposals: proposalReducer,
  },
});

export default store;
