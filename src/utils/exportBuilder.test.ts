import { describe, test, expect } from 'vitest';
import { buildExportData } from './exportBuilder';

describe('Формування файлу експорту (buildExportData)', () => {
  
  const mockProducts = [
    { id: 1, status: "в наявності", price: 10000 },
    { id: 2, status: "проданий", price: 15000 },
    { id: 3, status: "в наявності", price: 20000 }
  ];

  test('Повинен формувати експорт для Продавця (без списку користувачів)', () => {
    // 1. Arrange
    const seller = { name: "Іван", email: "ivan@test.com", role: "Продавець" };
    
    // 2. Act (не передаємо 3-й аргумент з базою користувачів)
    const result = buildExportData(seller, mockProducts);

    // 3. Assert
    expect(result.exportedBy.role).toBe("Продавець");
    expect(result.stats.totalProducts).toBe(3);
    expect(result.stats.sold).toBe(1);
    
    // Перевіряємо, що у продавця немає доступу до бази юзерів у файлі
    expect(result.users).toBeUndefined();
    expect(result.stats.totalUsers).toBeUndefined();
  });

  test('Повинен формувати розширений експорт для Адміністратора (з користувачами)', () => {
    // 1. Arrange
    const admin = { name: "Анна", email: "admin@test.com", role: "Адміністратор" };
    const mockUsers = [{ email: "user1@test.com" }, { email: "user2@test.com" }];
    
    // 2. Act (передаємо базу користувачів)
    const result = buildExportData(admin, mockProducts, mockUsers);

    // 3. Assert
    expect(result.exportedBy.role).toBe("Адміністратор");
    
    // Перевіряємо, що адміну коректно додалися дані про користувачів
    expect(result.stats.totalUsers).toBe(2);
    expect(result.users).toHaveLength(2);
  });

});