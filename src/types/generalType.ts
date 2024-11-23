export interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
  category: string;
}

export interface NewTransaction {
  type: "income" | "expense";
  amount: string;
  description: string;
}
export interface Category {
  id: string;
  label: string;
}

export type Theme = "light" | "dark";
export type Language = "tr" | "en";

export type TransactionType = "income" | "expense";
