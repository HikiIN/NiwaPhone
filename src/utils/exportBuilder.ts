interface IUserBase {
  name: string;
  email: string;
  role: string;
}

interface IProductLite {
  status: string;
  [key: string]: unknown;
}

interface IStats {
  totalProducts: number;
  inStock: number;
  sold: number;
  totalUsers?: number;
}

interface IExportData {
  exportedAt: string;
  exportedBy: IUserBase;
  stats: IStats;
  products: IProductLite[];
  users?: IUserBase[];
}

export function buildExportData(
  exportingUser: IUserBase,
  products: IProductLite[],
  allUsers: IUserBase[] | null = null
): IExportData {
  const stats: IStats = {
    totalProducts: products.length,
    inStock: products.filter((p) => p.status === "в наявності").length,
    sold: products.filter((p) => p.status === "проданий").length,
  };

  if (allUsers) {
    stats.totalUsers = allUsers.length;
  }

  const exportData: IExportData = {
    exportedAt: new Date().toISOString(),
    exportedBy: {
      name: exportingUser.name,
      email: exportingUser.email,
      role: exportingUser.role,
    },
    stats,
    products,
  };

  if (allUsers) {
    exportData.users = allUsers;
  }

  return exportData;
}