import { expect, test, describe } from 'vitest';
import { validateImportBody } from './productValidator';

describe('Валідація імпорту товарів', () => {
  
  test('Має повернути помилку, якщо products не являється масивом', () => {
    const fakeBody = { products: "я строка, а не массив" };

    const result = validateImportBody(fakeBody);

    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Файл не містить масиву products");
  });

  test('Повинен повернути успіх, якщо передано правильний масив', () => {
    const fakeBody = { products: [{ imei: "123" }, { imei: "456" }] };

    const result = validateImportBody(fakeBody);

    expect(result.isValid).toBe(true);
    expect(result.products).toHaveLength(2); 
  });

});