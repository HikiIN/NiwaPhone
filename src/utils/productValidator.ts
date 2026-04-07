export function validateImportBody(body: unknown) {
  const products = (body as Record<string, unknown>)?.products;
  
  if (!Array.isArray(products)) {
    return { isValid: false, error: "Файл не містить масиву products" };
  }
  
  return { isValid: true, products };
}