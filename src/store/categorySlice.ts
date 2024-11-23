import { Category } from "@/types/generalType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const STORAGE_KEY = "budget_categories";

interface CategoryState {
  categories: Category[];
}

const DEFAULT_CATEGORY: Category = { id: "diger", label: "Diğer" };

const loadInitialState = (): CategoryState => {
  if (typeof window === "undefined") {
    return { categories: [DEFAULT_CATEGORY] };
  }

  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const parsedCategories = JSON.parse(storedData);
      const filteredCategories = parsedCategories.filter(
        (cat: Category) => cat.id !== "all" && cat.id !== DEFAULT_CATEGORY.id
      );
      return { categories: [...filteredCategories, DEFAULT_CATEGORY] };
    }
  } catch (error) {
    console.error("Error loading categories from localStorage:", error);
  }

  return { categories: [DEFAULT_CATEGORY] };
};

const categorySlice = createSlice({
  name: "categories",
  initialState: loadInitialState(),
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      if (!state.categories.some((cat) => cat.id === action.payload.id)) {
        state.categories = [
          ...state.categories.filter((cat) => cat.id !== DEFAULT_CATEGORY.id),
          action.payload,
          DEFAULT_CATEGORY,
        ];

        // Update localStorage
        if (typeof window !== "undefined") {
          const categoriesToStore = state.categories.filter(
            (cat) => cat.id !== "all"
          );
          localStorage.setItem(STORAGE_KEY, JSON.stringify(categoriesToStore));
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
