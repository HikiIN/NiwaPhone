import { Search, Filter, Smartphone } from "lucide-react";

export default function Home() {
  const mockProducts = [
    { id: 1, model: "iPhone 15 Pro", imei: "359990123456789", price: 45000, year: 2023, status: "в наявності" },
    { id: 2, model: "Samsung Galaxy S24", imei: "358880987654321", price: 40000, year: 2024, status: "в наявності" },
    { id: 3, model: "Google Pixel 8", imei: "357770112233445", price: 32000, year: 2023, status: "проданий" }
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Шапка каталогу */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Каталог пристроїв</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Переглядайте наявні телефони та їх статус.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-zinc-400 group-focus-within:text-red-600 transition-colors" />
            <input
              type="text"
              placeholder="Пошук за моделлю або IMEI..."
              className="pl-10 pr-4 py-2 w-full md:w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Фільтри</span>
          </button>
        </div>
      </div>

      {/* Сітка товарів */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockProducts.map((product) => (
          <div
            key={product.id}
            className="group flex flex-col bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:shadow-xl hover:border-red-600/30 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-400 group-hover:text-red-600 group-hover:bg-red-50 dark:group-hover:bg-red-950/30 transition-colors">
                <Smartphone size={24} />
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                product.status === "в наявності" 
                  ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400" 
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}>
                {product.status}
              </span>
            </div>
            
            <h2 className="text-xl font-bold mb-4 line-clamp-1" title={product.model}>
              {product.model}
            </h2>
            
            <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6 flex-grow">
              <div className="flex justify-between">
                <span>IMEI:</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{product.imei}</span>
              </div>
              <div className="flex justify-between">
                <span>Рік випуску:</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{product.year}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-2xl font-bold text-red-600">
                {product.price.toLocaleString('uk-UA')} ₴
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}