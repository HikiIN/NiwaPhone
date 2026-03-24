// src/utils/analytics.ts

// Описываем интерфейс, чтобы TypeScript был доволен
interface IProductLite {
  price: number;
  status: "в наявності" | "проданий" | string;
}

export function calculateDashboardStats(products: IProductLite[]) {
  if (!products || products.length === 0) {
    return { inStock: 0, sold: 0, revenue: 0, avgPrice: 0 };
  }

  const inStock = products.filter(p => p.status === "в наявності").length;
  const soldProducts = products.filter(p => p.status === "проданий");
  const sold = soldProducts.length;
  
  // Рахуємо виручку тільки з проданих товарів
  const revenue = soldProducts.reduce((sum, p) => sum + p.price, 0);
  
  // Середня ціна по всіх товарах
  const avgPrice = Math.round(
    products.reduce((sum, p) => sum + p.price, 0) / products.length
  );

  return { inStock, sold, revenue, avgPrice };
}