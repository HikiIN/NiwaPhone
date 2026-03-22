"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "uk" | "en";

export const i18n = {
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
    guestHint: "Режим гостя дає змогу переглядати каталог без можливості редагувати товари",
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
    guestHint: "Guest mode allows browsing the catalog without editing products",
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
  },
} as const;

export type Translations = typeof i18n.uk;

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