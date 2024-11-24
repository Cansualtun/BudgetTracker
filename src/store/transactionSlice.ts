import { Transaction } from "@/types/generalType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const STORAGE_KEY = "budget_transactions";

interface TransactionState {
  transactions: Transaction[];
}

const loadInitialState = (): TransactionState => {
  if (typeof window === "undefined") {
    return { transactions: [] };
  }

  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const parsedTransactions = JSON.parse(storedData);
      return { transactions: parsedTransactions };
    }
  } catch (error) {
    console.error("Error loading transactions from localStorage:", error);
  }

  return { transactions: [] };
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState: loadInitialState(),
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions = [...state.transactions, action.payload];
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
      }
    },
    removeTransaction: (state, action: PayloadAction<number>) => {
      // string yerine number kullanıyoruz
      state.transactions = state.transactions.filter(
        (transaction) => transaction.id !== action.payload
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
      }
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
      }
    },
  },
});

export const { addTransaction, removeTransaction, setTransactions } =
  transactionSlice.actions;
export default transactionSlice.reducer;
