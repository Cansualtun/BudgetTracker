import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./categorySlice";
import transactionReducer from "./transactionSlice";

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    transactions: transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
