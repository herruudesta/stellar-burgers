import { getIngredientsApi } from '@api';

import { TIngredient } from '@utils-types';

import {
  SerializedError,
  createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';

interface TIngredientsState {
  isLoading: boolean;
  error: SerializedError | null;
  data: TIngredient[];
}

const initialState: TIngredientsState = {
  isLoading: true,
  error: null,
  data: []
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetch',
  async () => getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  }
});

export default ingredientsSlice.reducer;
