import { Search, Filter } from "lucide-react";

export default function Catalog()
{
    const mockProducts = [
    {
        id: 1,
        model: "iPhone 15 Pro",
        imei: "359990123456789",
        price: 45000,
        year: 2023,
        status: "в наявності"
    },
    {
        id: 2,
        model: "Samsung Galaxy S24",
        imei: "358880987654321",
        price: 40000,
        year: 2024,
        status: "в наявності"
    },
    {
        id: 3,
        model: "Google Pixel 8",
        imei: "357770112233445",
        price: 32000,
        year: 2023,
        status: "проданий"
    }
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
            <header className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-red-600">
                    NiwaPhone
                </h1>
                <div className="flex gap-4">
                    <button className="bg-white border border-gray-300 p-2 rounded-lg flex items-center gap-2 hover:bg-gray-100">
                        <Filter className="w-5 h-5" />
                        Фільтри
                    </button>
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Пошук за моделлю або IMEI..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-80 focus:outline-none focus:border-red-600"
                        />
                    </div>
                </div>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockProducts.map((product) =>
                {
                    return (
                        <div
                            key={product.id}
                            className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold">
                                    {product.model}
                                </h2>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.status === "в наявності" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                    {product.status}
                                </span>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600 mb-6">
                                <p>
                                    <span className="font-medium text-gray-900">IMEI:</span> {product.imei}
                                </p>
                                <p>
                                    <span className="font-medium text-gray-900">Рік:</span> {product.year}
                                </p>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-red-600">
                                    {product.price} ₴
                                </span>
                                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                                    Продати
                                </button>
                            </div>
                        </div>
                    );
                }
                )}
            </main>
        </div>
    );
}