import { Category, Transaction } from "@/types/generalType";
import toast from "react-hot-toast";

interface ExpenseWarningOptions {
  showToast?: boolean;
  warningThreshold?: number;
}

export const checkCategoryExpenseLimit = (
  transactions: Transaction[],
  category: Category,
  options: ExpenseWarningOptions = {}
): { hasWarning: boolean; percentage: number } => {
  const { showToast = true, warningThreshold = 80 } = options;

  if (category.type !== "expense" || !category.limit) {
    return { hasWarning: false, percentage: 0 };
  }

  const totalExpense = transactions
    .filter((t) => t.category === category.id && t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const percentage = (totalExpense / category.limit) * 100;

  const hasWarning = percentage >= warningThreshold;

  if (hasWarning && showToast) {
    const remainingBudget = category.limit - totalExpense;
    toast.error(
      `Dikkat: "${
        category.label
      }" kategorisinde bütçe limitinin ${percentage.toFixed(
        1
      )}%'ine ulaştınız! Kalan limit: ₺${remainingBudget.toLocaleString()}`,
      {
        duration: 5000,
        icon: "⚠️",
      }
    );
  }

  return { hasWarning, percentage };
};

export const checkAllCategoryLimits = (
  transactions: Transaction[],
  categories: Category[],
  options: ExpenseWarningOptions = {}
) => {
  const warnings = categories
    .filter((category) => category.type === "expense" && category.limit)
    .map((category) => ({
      category,
      ...checkCategoryExpenseLimit(transactions, category, options),
    }))
    .filter((result) => result.hasWarning);

  return warnings;
};
