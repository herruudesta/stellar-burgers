import { AppDispatch, RootState } from '../../services/store';

import { createOrder, resetConstructor } from '@slices';
import { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';

const middleware: Middleware =
  (store: MiddlewareAPI<AppDispatch, RootState>) => (next) => (action) => {
    if (createOrder.fulfilled.match(action)) {
      store.dispatch(resetConstructor());
    }
    next(action);
  };
export default middleware;
