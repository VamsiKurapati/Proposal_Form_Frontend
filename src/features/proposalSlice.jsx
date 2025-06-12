// src/features/proposals/proposalSlice.js
import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import axios from 'axios';
// import { list } from 'postcss';

export const fetchProposals = createAsyncThunk(
  'proposals/fetchProposals',
  async (_, thunkAPI) => {
    try {
      const res = await axios.post('https://proposal-form-backend.vercel.app/api/proposals',{
        name: 'Rahul Sharma',
        email: 'test@gmail.com',
      });
      return res.data; // return the list directly
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to fetch proposals');
    }
  }
);

const proposalSlice = createSlice({
  name: 'proposals',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addProposal: (state, action) => {
      if( state.list.length >= 5 ) {
        console.warn('Maximum number of proposals reached. Cannot add more.');
        return;
      }
      const newProposal = { id: nanoid(), ...action.payload };
      state.list.push(newProposal);
    },
    editProposal: (state, action) => {
      const idx = state.list.findIndex(p => p._id === action.payload.id);
      if (idx !== -1) {
        state.list[idx] = action.payload;
      }
    },
    deleteProposal: (state, action) => {
      state.list = state.list.filter(p => p._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProposals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProposals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload; // Store fetched data
      })
      .addCase(fetchProposals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { addProposal, editProposal, deleteProposal } = proposalSlice.actions;
export default proposalSlice.reducer;
