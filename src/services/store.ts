import {
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { configureStore, combineReducers } from '@reduxjs/toolkit';

import ordersMiddleware from './middleware/index';

import builderReducer from './slices/builder';
import feedsReducer from './slices/feeds';
import ingredientsReducer from './slices/ingredients';
import ordersReducer from './slices/orders';
import userReducer from './slices/user';

export const rootReducer = combineReducers({
  user: userReducer,
  builder: builderReducer,
  ingredients: ingredientsReducer,
  feeds: feedsReducer,
  orders: ordersReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ordersMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
