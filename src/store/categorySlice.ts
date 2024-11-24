import { Category } from "@/types/generalType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const STORAGE_KEY = "budget_categories";

interface CategoryState {
  categories: Category[];
}

const loadInitialState = (): CategoryState => {
  if (typeof window === "undefined") {
    return { categories: [] };
  }

  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const parsedCategories = JSON.parse(storedData);
      return { categories: parsedCategories };
    }
  } catch (error) {
    console.error("Error loading categories from localStorage:", error);
  }

  return { categories: [] };
};

const categorySlice = createSlice({
  name: "categories",
  initialState: loadInitialState(),
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      if (!state.categories.some((cat) => cat.id === action.payload.id)) {
        state.categories = [...state.categories, action.payload];

        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state.categories));
        }
      }
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
  },
});

export const { addCategory, setCategories } = categorySlice.actions;
export default categorySlice.reducer;
