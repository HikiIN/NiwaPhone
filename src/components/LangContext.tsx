"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "uk" | "en";

const i18n: Record<Lang, Translations> = {
  uk: {
    // Navbar
    catalog: "Каталог",
    dashboard: "Дашборд",
    signIn: "Увійти",

    // Footer
    systemActive: "Система активна",
    dbChecking: "БД: перевірка…",
    dbOnline: "Online",
    dbOffline: "Offline",
    madeBy: "Розроблено",

    // Profile
    cabinet: "Кабінет",
    cabinetSub: "Інформація вашого облікового запису",
    accountData: "Дані акаунта",
    fieldName: "Ім'я",
    fieldEmail: "Email",
    fieldRole: "Роль",
    fieldLoginVia: "Вхід через",
    permissions: "Можливості",
    exportDb: "Вивантажити БД",
    exportDbSub: "Завантажити дані у форматі JSON",
    switchLang: "Switch to English",
    switchLangSub: "Перемкнути інтерфейс на англійську",
    exporting: "Завантаження...",
    exported: "Готово!",
    perms: {
      view: "Перегляд каталогу",
      search: "Пошук та фільтрація",
      status: "Зміна статусу товару",
      add: "Додавання товарів",
      edit: "Редагування товарів",
      delete: "Видалення товарів",
      dashboard: "Доступ до дашборду",
      analytics: "Аналітика продажів",
    },

    // Login
    loginSubtitle: "Система обліку магазину телефонів",
    loginSection: "Вхід до системи",
    signInGoogle: "Увійти через Google",
    connecting: "Підключення...",
    continueGuest: "Продовжити як гість",
    loading: "Завантаження...",
    guestHint: "Режим гостя — тільки перегляд каталогу без редагування",
    rights: "Всі права захищені",

    // Головна / фільтри
    searchPlaceholder: "Пошук за моделлю або IMEI...",
    filterAll: "Всі",
    filterInStock: "В наявності",
    filterSold: "Продані",
    addProduct: "Додати товар",
    nothingFound: "Нічого не знайдено",

    // ProductCard / модалки
    inStock: "В наявності",
    sold: "Проданий",
    edit: "Редагувати",
    markSold: "Позначити проданим",
    deleteProduct: "Видалити товар",

    // Ролі
    roleGuest: "Гість",
    roleSeller: "Продавець",
    roleAdmin: "Адміністратор",
    roleDescription: {
      guest: "Перегляд каталогу без редагування",
      seller: "Перегляд + зміна статусу товарів",
      admin: "Повний доступ до системи",
    },

    // Постачальники
    suppliers: {
      title: "Постачальники",
      subtitle: "Маршрути та партнери магазину",
      search: "Пошук постачальника…",
      all: "Всі",
      active: "Активні",
      paused: "На паузі",
      metricSupp: "Постачальники",
      metricAct: "Активних",
      metricDel: "Поставлено",
      metricCost: "Витрачено на закупку",
      empty: "Постачальників не знайдено",
      statusActive: "Активний",
      statusPaused: "Пауза",
      statusPausedFull: "Пауза — співпраця призупинена",
      since: "з",
      items: "Товарів",
      soldCount: "Продано",
      revenue: "Виручка",
      days: "дн.",
      contacts: "Контакти",
      deliveryRoute: "Маршрут доставки",
      destination: "Призначення",
      phonePurchasing: "Закупка телефонів",
      buyingCheaperBy: "Купуємо дешевше на",
      offStorePrice: "від ціни в магазині",
      forSaleNow: "На продажу зараз",
      phonesInStore: "телефонів висять у магазині",
      eachPhoneCostUs: "Закупили кожен в середньому за",
      avgPricePerUnit: "середня ціна одного телефону у постачальника",
      spentOnPurchasing: "Витрачено на закупку",
      totalPaidForStock: "стільки заплатили за всі телефони що зараз у магазині",
      earnedFromSold: "Зароблено з проданих",
      revenueMinusCost: "виручка мінус те що заплатили постачальнику",
      salesRate: "Рівень продажів",
      deliveryTime: "Час доставки",
      deliveryDays: "днів",
      wholesalePaidFor: "За скільки куплені смартфони що зараз на продажу",
      pcs: "шт.",
      wholesale: "опт",
    },

    // Dashboard
    dashboardPage: {
      analyticsSubtitle: "Аналітика магазину в реальному часі",
      inStock:    "В наявності",
      soldMetric: "Продано",
      revenue:    "Виручка",
      avgPrice:   "Сер. ціна",
      salesChart: "Продажі (6 місяців)",
      byBrand:    "По брендах",
      top5:       "Топ-5 за ціною",
      noProducts: "Немає товарів",
      soldLabel:  "Продано",
      totalLabel: "Всього",
    },

    // SalesTable
    salesTable: {
      title:     "Список продажів",
      search:    "Пошук моделі / IMEI…",
      allYears:  "Всі роки",
      allBrands: "Всі бренди",
      date:      "Дата",
      model:     "Модель",
      brand:     "Бренд",
      price:     "Ціна",
      imei:      "IMEI",
      purchase:  "закуп ~",
      empty:     "Немає продажів за фільтром",
      of:        "з",
      results:   "результатів",
    },
  },

  en: {
    // Navbar
    catalog: "Catalog",
    dashboard: "Dashboard",
    signIn: "Sign In",

    // Footer
    systemActive: "System active",
    dbChecking: "DB: checking…",
    dbOnline: "Online",
    dbOffline: "Offline",
    madeBy: "Built by",

    // Profile
    cabinet: "Profile",
    cabinetSub: "Your account information",
    accountData: "Account Details",
    fieldName: "Name",
    fieldEmail: "Email",
    fieldRole: "Role",
    fieldLoginVia: "Signed in via",
    permissions: "Permissions",
    exportDb: "Export Database",
    exportDbSub: "Download all data as JSON",
    switchLang: "Перейти на українську",
    switchLangSub: "Switch interface back to Ukrainian",
    exporting: "Exporting...",
    exported: "Done!",
    perms: {
      view: "Browse catalog",
      search: "Search & filter",
      status: "Change product status",
      add: "Add products",
      edit: "Edit products",
      delete: "Delete products",
      dashboard: "Dashboard access",
      analytics: "Sales analytics",
    },

    // Login
    loginSubtitle: "Phone store management system",
    loginSection: "Sign in to continue",
    signInGoogle: "Continue with Google",
    connecting: "Connecting...",
    continueGuest: "Continue as Guest",
    loading: "Loading...",
    guestHint: "Guest mode — browse catalog only, no editing",
    rights: "All rights reserved",

    // Головна / фільтри
    searchPlaceholder: "Search by model or IMEI...",
    filterAll: "All",
    filterInStock: "In Stock",
    filterSold: "Sold",
    addProduct: "Add Product",
    nothingFound: "Nothing found",

    // ProductCard / модалки
    inStock: "In Stock",
    sold: "Sold",
    edit: "Edit",
    markSold: "Mark as Sold",
    deleteProduct: "Delete Product",

    // Ролі
    roleGuest: "Guest",
    roleSeller: "Seller",
    roleAdmin: "Administrator",
    roleDescription: {
      guest: "Browse catalog without editing",
      seller: "View + change product status",
      admin: "Full system access",
    },

    // Suppliers
    suppliers: {
      title: "Suppliers",
      subtitle: "Store routes & partners",
      search: "Search supplier…",
      all: "All",
      active: "Active",
      paused: "Paused",
      metricSupp: "Suppliers",
      metricAct: "Active",
      metricDel: "Delivered",
      metricCost: "Spent on stock",
      empty: "No suppliers found",
      statusActive: "Active",
      statusPaused: "Paused",
      statusPausedFull: "Paused — partnership on hold",
      since: "since",
      items: "Items",
      soldCount: "Sold",
      revenue: "Revenue",
      days: "days",
      contacts: "Contacts",
      deliveryRoute: "Delivery route",
      destination: "Destination",
      phonePurchasing: "Phone purchasing",
      buyingCheaperBy: "We buy cheaper by",
      offStorePrice: "off the store price",
      forSaleNow: "For sale now",
      phonesInStore: "phones listed in the store",
      eachPhoneCostUs: "Each phone cost us",
      avgPricePerUnit: "average price paid per unit",
      spentOnPurchasing: "Spent on purchasing",
      totalPaidForStock: "total paid for all phones currently in stock",
      earnedFromSold: "Earned from sold phones",
      revenueMinusCost: "revenue minus what we paid the supplier",
      salesRate: "Sales rate",
      deliveryTime: "Delivery time",
      deliveryDays: "days",
      wholesalePaidFor: "How much was paid for phones currently on sale",
      pcs: "pcs",
      wholesale: "wholesale",
    },

    // Dashboard
    dashboardPage: {
      analyticsSubtitle: "Real-time store analytics",
      inStock:    "In Stock",
      soldMetric: "Sold",
      revenue:    "Revenue",
      avgPrice:   "Avg. Price",
      salesChart: "Sales (6 months)",
      byBrand:    "By Brand",
      top5:       "Top 5 by Price",
      noProducts: "No products",
      soldLabel:  "Sold",
      totalLabel: "Total",
    },

    // SalesTable
    salesTable: {
      title:     "Sales List",
      search:    "Search model / IMEI…",
      allYears:  "All years",
      allBrands: "All brands",
      date:      "Date",
      model:     "Model",
      brand:     "Brand",
      price:     "Price",
      imei:      "IMEI",
      purchase:  "cost ~",
      empty:     "No sales match filter",
      of:        "of",
      results:   "results",
    },
  },
};

export interface SuppliersTranslations {
  title: string;
  subtitle: string;
  search: string;
  all: string;
  active: string;
  paused: string;
  metricSupp: string;
  metricAct: string;
  metricDel: string;
  metricCost: string;
  empty: string;
  statusActive: string;
  statusPaused: string;
  statusPausedFull: string;
  since: string;
  items: string;
  soldCount: string;
  revenue: string;
  days: string;
  contacts: string;
  deliveryRoute: string;
  destination: string;
  phonePurchasing: string;
  buyingCheaperBy: string;
  offStorePrice: string;
  forSaleNow: string;
  phonesInStore: string;
  eachPhoneCostUs: string;
  avgPricePerUnit: string;
  spentOnPurchasing: string;
  totalPaidForStock: string;
  earnedFromSold: string;
  revenueMinusCost: string;
  salesRate: string;
  deliveryTime: string;
  deliveryDays: string;
  wholesalePaidFor: string;
  pcs: string;
  wholesale: string;
}

export interface DashboardPageTranslations {
  analyticsSubtitle: string;
  inStock: string;
  soldMetric: string;
  revenue: string;
  avgPrice: string;
  salesChart: string;
  byBrand: string;
  top5: string;
  noProducts: string;
  soldLabel: string;
  totalLabel: string;
}

export interface SalesTableTranslations {
  title: string;
  search: string;
  allYears: string;
  allBrands: string;
  date: string;
  model: string;
  brand: string;
  price: string;
  imei: string;
  purchase: string;
  empty: string;
  of: string;
  results: string;
}

export interface Translations {
  catalog: string;
  dashboard: string;
  signIn: string;
  systemActive: string;
  dbChecking: string;
  dbOnline: string;
  dbOffline: string;
  madeBy: string;
  cabinet: string;
  cabinetSub: string;
  accountData: string;
  fieldName: string;
  fieldEmail: string;
  fieldRole: string;
  fieldLoginVia: string;
  permissions: string;
  exportDb: string;
  exportDbSub: string;
  switchLang: string;
  switchLangSub: string;
  exporting: string;
  exported: string;
  perms: {
    view: string;
    search: string;
    status: string;
    add: string;
    edit: string;
    delete: string;
    dashboard: string;
    analytics: string;
  };
  loginSubtitle: string;
  loginSection: string;
  signInGoogle: string;
  connecting: string;
  continueGuest: string;
  loading: string;
  guestHint: string;
  rights: string;
  searchPlaceholder: string;
  filterAll: string;
  filterInStock: string;
  filterSold: string;
  addProduct: string;
  nothingFound: string;
  inStock: string;
  sold: string;
  edit: string;
  markSold: string;
  deleteProduct: string;
  roleGuest: string;
  roleSeller: string;
  roleAdmin: string;
  roleDescription: {
    guest: string;
    seller: string;
    admin: string;
  };
  suppliers: SuppliersTranslations;
  dashboardPage: DashboardPageTranslations;
  salesTable: SalesTableTranslations;
}

interface LangContextValue {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("uk");

  useEffect(() => {
    const saved = localStorage.getItem("niwaphone_lang") as Lang | null;
    if (saved === "uk" || saved === "en") setLang(saved);
  }, []);

  const toggleLang = () => {
    const next: Lang = lang === "uk" ? "en" : "uk";
    setLang(next);
    localStorage.setItem("niwaphone_lang", next);
  };

  return (
    <LangContext.Provider value={{ lang, t: i18n[lang], toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}