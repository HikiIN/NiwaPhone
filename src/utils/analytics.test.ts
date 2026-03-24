import { describe, test, expect } from 'vitest';
import { calculateDashboardStats } from './analytics';

describe('Аналітика дашборду (calculateDashboardStats)', () => {
  
  test('Повинна правильно рахувати виручку та залишки для списку товарів', () => {
    const mockProducts = [
      { price: 30000, status: "проданий" },    // Продано (Виручка: 30000)
      { price: 40000, status: "проданий" },    // Продано (Виручка: 40000)
      { price: 20000, status: "в наявності" }, // На складі
      { price: 10000, status: "в наявності" }  // На складі
    ];

    const result = calculateDashboardStats(mockProducts);

    expect(result.sold).toBe(2);
    expect(result.inStock).toBe(2);
    expect(result.revenue).toBe(70000); // Виручка має бути 30к + 40к = 70к
    expect(result.avgPrice).toBe(25000); // Середня ціна (100к / 4) = 25к
  });

  test('Повинна безпечно обробляти порожній масив товарів', () => {
    const result = calculateDashboardStats([]);
    
    expect(result.sold).toBe(0);
    expect(result.revenue).toBe(0);
    expect(result.avgPrice).toBe(0);
  });

});