import { fetchIngredients, ingredientsInitialState } from '../services/slices';
import reducer from '../services/slices/ingredients';

const mockIngredientsData = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0
  }
];

describe('Тестирование ingredientsReducer', () => {
  describe('Асинхронная функция получения ингредиентов: fetchIngredients', () => {
    test('Начало запроса: fetchIngredients.pending', () => {
      const updatedState = reducer(
        ingredientsInitialState,
        fetchIngredients.pending('pending')
      );
      expect(updatedState.isLoading).toBe(true);
      expect(updatedState.error).toBeNull();
    });

    test('Успешное завершение запроса: fetchIngredients.fulfilled', () => {
      const updatedState = reducer(
        ingredientsInitialState,
        fetchIngredients.fulfilled(mockIngredientsData, 'fulfilled')
      );
      expect(updatedState.isLoading).toBe(false);
      expect(updatedState.error).toBeNull();
      expect(updatedState.data).toEqual(mockIngredientsData);
    });

    test('Ошибка запроса: fetchIngredients.rejected', () => {
      const errorMessage = 'fetchIngredients.rejected';
      const updatedState = reducer(
        ingredientsInitialState,
        fetchIngredients.rejected(new Error(errorMessage), 'rejected')
      );
      expect(updatedState.isLoading).toBe(false);
      expect(updatedState.error?.message).toEqual(errorMessage);
    });
  });
});
