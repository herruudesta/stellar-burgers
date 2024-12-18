import { rootReducer, store } from '../services/store';

describe('Тестирование rootReducer', () => {
  test('Возврат предыдущего состояния при вызове с UNKNOWN_ACTION и undefined', () => {
    const initialState = store.getState();
    const newState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(newState).toEqual(initialState);
  });
});