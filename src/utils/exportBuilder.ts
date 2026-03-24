interface IUserBase {
  name: string;
  email: string;
  role: string;
}

interface IProductLite {
  status: string;
  [key: string]: any;
}

export function buildExportData(
  exportingUser: IUserBase,
  products: IProductLite[],
  allUsers: any[] | null = null
) {
  const stats: any = {
    totalProducts: products.length,
    inStock: products.filter((p) => p.status === "в наявності").length,
    sold: products.filter((p) => p.status === "проданий").length,
  };

  if (allUsers) {
    stats.totalUsers = allUsers.length;
  }

  const exportData: any = {
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