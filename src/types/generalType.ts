export interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: Category;
}

export interface NewTransaction {
  type: "income" | "expense";
  amount: string;
  description: string;
}
export type Theme = "light" | "dark";
export type Language = "tr" | "en";

export type Category =
  | "mutfak"
  | "kozmetik"
  | "egitim"
  | "ulasim"
  | "eglence"
  | "diger";

export type TransactionType = "income" | "expense";
