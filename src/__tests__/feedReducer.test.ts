import { fetchFeeds, feedsInitialState } from '../services/slices';

import reducer from '../services/slices/feeds';

const mockFeedsData = {
  orders: [],
  total: 1,
  totalToday: 1,
};

describe('Тестирование feedsReducer', () => {
  describe('Асинхронная функция получения ленты заказов: fetchFeeds', () => {
    
    test('Начало запроса: fetchFeeds.pending', () => {
      const updatedState = reducer(feedsInitialState, fetchFeeds.pending('pending'));
      expect(updatedState.isLoading).toBeTruthy();
      expect(updatedState.error).toBeNull();
    });

    test('Успешное завершение запроса: fetchFeeds.fulfilled', () => {
      const updatedState = reducer(
        feedsInitialState,
        fetchFeeds.fulfilled(mockFeedsData, 'fulfilled')
      );
      expect(updatedState.isLoading).toBeFalsy();
      expect(updatedState.error).toBeNull();
      expect(updatedState.data).toEqual(mockFeedsData);
    });

    test('Ошибка запроса: fetchFeeds.rejected', () => {
      const errorMessage = 'fetchFeeds.rejected';
      const updatedState = reducer(
        feedsInitialState,
        fetchFeeds.rejected(new Error(errorMessage), 'rejected')
      );
      expect(updatedState.isLoading).toBeFalsy();
      expect(updatedState.error?.message).toEqual(errorMessage);
    });
  });
});
