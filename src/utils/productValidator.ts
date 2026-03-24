export function validateImportBody(body: any) {
  const products = body?.products;
  
  if (!Array.isArray(products)) {
    return { isValid: false, error: "Файл не містить масиву products" };
  }
  
  return { isValid: true, products };
}